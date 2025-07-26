import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmailSMTP, testSMTPConnection } from '@/lib/smtp-email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admins to test email
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      );
    }

    // Test SMTP configuration
    console.log('Testing SMTP email with ZeptoMail...');
    console.log('Environment variables:', {
      hasSmtpHost: !!process.env.ZEPTOMAIL_SMTP_HOST,
      hasSmtpPass: !!process.env.ZEPTOMAIL_SMTP_PASS,
      smtpHost: process.env.ZEPTOMAIL_SMTP_HOST,
      smtpPort: process.env.ZEPTOMAIL_SMTP_PORT,
      sender: process.env.ZEPTOMAIL_SENDER,
      senderName: process.env.ZEPTOMAIL_SENDER_NAME,
    });

    // First test the SMTP connection
    const connectionOk = await testSMTPConnection();
    if (!connectionOk) {
      return NextResponse.json(
        { error: 'SMTP connection test failed. Please check your SMTP configuration.' },
        { status: 500 }
      );
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c1272d;">Test Email from AETech</h2>
        <p>This is a test email to verify SMTP configuration.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
        <p style="color: #666; font-size: 14px;">
          Sent from AETech Research Labs Contact System via SMTP
        </p>
      </div>
    `;

    const result = await sendEmailSMTP({
      to,
      subject: `[TEST] ${subject}`,
      html: htmlBody,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully via SMTP',
      result,
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
