import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/zeptomail';

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

    // Test email configuration
    console.log('Testing email with ZeptoMail...');
    console.log('Environment variables:', {
      hasApiKey: !!process.env.ZEPTOMAIL_API_KEY,
      sender: process.env.ZEPTOMAIL_SENDER,
      senderName: process.env.ZEPTOMAIL_SENDER_NAME,
    });

    const htmlBody = `
      <h2>Test Email from AETech</h2>
      <p>${message}</p>
      <hr>
      <p><small>This is a test email sent from the AETech admin panel.</small></p>
    `;

    const result = await sendEmail({
      to,
      subject: `[TEST] ${subject}`,
      htmlBody,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
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
