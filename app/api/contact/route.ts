import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactNotificationSMTP, sendContactConfirmationSMTP, testSMTPConnection } from '@/lib/smtp-email'
import { contactLogger } from '@/lib/contact-logger'

// POST /api/contact - Enhanced contact form (handles additional fields)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, country, subject, message, company, projectType, budget, timeline } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Create enhanced message including all form fields
    const enhancedMessage = `${message}

--- Project Details ---
Company: ${company || 'Not specified'}
Project Type: ${projectType || 'Not specified'}
Budget: ${budget || 'Not specified'}
Timeline: ${timeline || 'Not specified'}
Phone: ${phone || 'Not provided'}
Country: ${country || 'Not specified'}`

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        country: country || null,
        subject,
        message: enhancedMessage, // Store the enhanced message
        status: 'NEW'
      }
    })

    // Log the contact submission with detailed console output
    contactLogger.logSubmission({
      id: contact.id,
      name,
      email,
      phone,
      country,
      subject,
      message: enhancedMessage,
      status: 'NEW'
    });

    // Log additional project details to console
    console.log('📋 Additional Project Details:', {
      company,
      projectType,
      budget,
      timeline
    });

    // Send email notifications using SMTP
    try {
      // Check if SMTP is configured
      if (process.env.ZEPTOMAIL_SMTP_HOST && process.env.ZEPTOMAIL_SMTP_PASS) {
        console.log('📧 Attempting to send emails via ZeptoMail SMTP...');
        
        // Test connection first
        const connectionOk = await testSMTPConnection();
        
        if (connectionOk) {
          // Send notification to admin with enhanced details
          await sendContactNotificationSMTP({
            name,
            email,
            phone,
            country,
            subject,
            message: enhancedMessage,
          });

          console.log('✅ Admin notification sent successfully via SMTP');

          // Send confirmation to user
          await sendContactConfirmationSMTP({
            name,
            email,
            subject,
          });

          console.log('✅ User confirmation sent successfully via SMTP');
        } else {
          console.log('❌ SMTP connection test failed');
        }
      } else {
        console.log('⚠️  ZeptoMail SMTP not configured, skipping email notifications');
        console.log('📧 Contact details saved to database and logged to console');
      }
    } catch (emailError) {
      console.error('❌ Error sending emails via SMTP:', emailError);
      // Continue without failing the contact creation
    }

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}
