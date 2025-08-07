import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { sendEmailSMTP } from '../../../../lib/smtp-email'

interface EmailError {
  email: string
  error: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { subject, content, recipients, senderConfig } = await request.json()

    if (!subject || !content || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields: subject, content, and recipients' },
        { status: 400 }
      )
    }

    if (!Array.isArray(recipients)) {
      return NextResponse.json(
        { message: 'Recipients must be an array of email addresses' },
        { status: 400 }
      )
    }

    // Validate email addresses with enhanced parsing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let validRecipients: string[] = []
    
    // Enhanced email parsing to handle different formats
    const parseEmails = (emailString: string): string[] => {
      const emails: string[] = []
      
      // Split by newlines and commas
      const lines = emailString.split(/[\n,]/)
      
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        
        // Handle "Name <email@domain.com>" format
        const nameEmailMatch = trimmed.match(/^.*<([^>]+)>.*$/)
        if (nameEmailMatch) {
          emails.push(nameEmailMatch[1].trim())
        } else {
          // Handle plain email
          emails.push(trimmed)
        }
      }
      
      return emails
    }
    
    if (Array.isArray(recipients)) {
      // If already an array, use as is
      validRecipients = recipients.filter(email => emailRegex.test(email))
    } else if (typeof recipients === 'string') {
      // If string, parse it
      const parsedEmails = parseEmails(recipients)
      validRecipients = parsedEmails.filter(email => emailRegex.test(email))
    } else {
      validRecipients = []
    }
    
    // Remove duplicates
    validRecipients = [...new Set(validRecipients)]
    
    if (validRecipients.length === 0) {
      return NextResponse.json(
        { message: 'No valid email addresses found in recipients' },
        { status: 400 }
      )
    }
    
    const allRecipients = Array.isArray(recipients) ? recipients : (typeof recipients === 'string' ? parseEmails(recipients) : [])
    const invalidRecipients = allRecipients.filter(email => !emailRegex.test(email))
    if (invalidRecipients.length > 0) {
      console.warn('Invalid email addresses skipped:', invalidRecipients)
    }

    // Prepare email configuration - use the alias selected by user
    const emailConfig = {
      senderEmail: senderConfig?.senderEmail || process.env.ZEPTOMAIL_SENDER || 'noreply@aetechlabs.com',
      senderName: senderConfig?.senderName || process.env.ZEPTOMAIL_SENDER_NAME || 'AETech Research Labs',
      replyTo: senderConfig?.replyTo || process.env.ADMIN_EMAIL || 'info@aetechlabs.com'
    }

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50
    const batches = []
    for (let i = 0; i < validRecipients.length; i += batchSize) {
      batches.push(validRecipients.slice(i, i + batchSize))
    }

    let successCount = 0
    let errorCount = 0
    const errors: EmailError[] = []

    // Convert markdown-like content to HTML
    const convertMarkdownToHtml = (markdown: string): string => {
      let html = markdown
        // Convert headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Convert bold text
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/__(.*?)__/gim, '<strong>$1</strong>')
        
        // Convert italic text
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/_(.*?)_/gim, '<em>$1</em>')
        
        // Convert links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #c1272d; text-decoration: none;">$1</a>')
        
        // Convert images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />')
        
        // Convert line breaks
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>')
        
        // Convert lists
        .replace(/^\* (.+$)/gim, '<li>$1</li>')
        .replace(/^- (.+$)/gim, '<li>$1</li>')
        
        // Convert blockquotes
        .replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>')
        
        // Convert code blocks
        .replace(/```([\s\S]*?)```/gim, '<pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0; overflow-x: auto;"><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code style="background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')

      // Wrap in paragraphs if not already wrapped
      if (!html.includes('<p>') && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>') && !html.includes('<ul>') && !html.includes('<ol>')) {
        html = `<p>${html}</p>`
      }

      // Fix list wrapping
      html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
      
      return html
    }

    // Convert the markdown content to HTML
    const htmlContent = convertMarkdownToHtml(content)

    // Create HTML email template
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #c1272d;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            color: #c1272d;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .footer a {
            color: #c1272d;
            text-decoration: none;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          blockquote {
            border-left: 4px solid #c1272d;
            margin: 0;
            padding: 0 0 0 20px;
            font-style: italic;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #c1272d;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">AETech Research Labs</div>
          <p>Advanced Engineering & Technology Solutions</p>
        </div>
        
        <div class="content">
          ${htmlContent}
        </div>
        
        <div class="footer">
          <p>
            <strong>AETech Research Labs</strong><br>
            Suite 30, Es-Em Plaza, Utako<br>
            Abuja, Nigeria<br>
            <a href="tel:+2347044400347">+234 704 440 0347</a> | 
            <a href="mailto:info@aetechlabs.com">info@aetechlabs.com</a>
          </p>
          <p>
            <a href="https://www.aetechlabs.com">Visit our website</a> | 
            <a href="https://www.aetechlabs.com/privacy">Privacy Policy</a> | 
            <a href="mailto:${emailConfig.replyTo}?subject=Unsubscribe">Unsubscribe</a>
          </p>
          <p><small>This email was sent from ${emailConfig.senderEmail}</small></p>
        </div>
      </body>
      </html>
    `

    for (const batch of batches) {
      try {
        const emailPromises = batch.map(async (recipientEmail: string) => {
          // Use the same SMTP approach as contact form
          return await sendEmailSMTP({
            to: recipientEmail,
            subject: subject,
            html: htmlBody,
            text: htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
            fromName: emailConfig.senderName,
            fromEmail: emailConfig.senderEmail
          })
        })

        const results = await Promise.allSettled(emailPromises)
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++
          } else {
            errorCount++
            errors.push({
              email: batch[index],
              error: result.reason?.message || 'Unknown error'
            })
          }
        })

        // Add a small delay between batches to be respectful to the email service
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

      } catch (batchError) {
        console.error('Batch error:', batchError)
        errorCount += batch.length
        batch.forEach(email => {
          errors.push({
            email,
            error: batchError instanceof Error ? batchError.message : 'Batch processing failed'
          })
        })
      }
    }

    // Prepare response
    const response = {
      success: true,
      message: `Email campaign completed. ${successCount} sent successfully, ${errorCount} failed.`,
      details: {
        totalRecipients: validRecipients.length,
        successCount,
        errorCount,
        invalidEmails: invalidRecipients,
        errors: errors.slice(0, 10) // Limit error details to first 10 for response size
      }
    }

    if (errorCount > 0) {
      console.warn('Marketing email errors:', errors)
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Marketing email error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to send marketing email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
