import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmailSMTP } from '@/lib/smtp-email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is logged in and has admin role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { to, subject, content, studentName } = await request.json()

    if (!to || !subject || !content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert content line breaks to HTML
    const htmlContent = content.replace(/\n/g, '<br>')

    // Send email using SMTP
    await sendEmailSMTP({
      to,
      subject,
      html: htmlContent,
      text: content,
      fromName: 'AETech DevStarter Bootcamp',
      fromEmail: 'info@aetechlabs.com'
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    )
  }
}
