import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendContactNotificationSMTP, sendContactConfirmationSMTP, testSMTPConnection } from '@/lib/smtp-email'
import { contactLogger } from '@/lib/contact-logger'

// GET /api/contacts - Get all contacts for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create new contact (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, country, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        country: country || null,
        subject,
        message,
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
      message,
      status: 'NEW'
    });

    // Send email notifications using SMTP
    try {
      // Check if SMTP is configured
      if (process.env.ZEPTOMAIL_SMTP_HOST && process.env.ZEPTOMAIL_SMTP_PASS) {
        console.log('📧 Attempting to send emails via ZeptoMail SMTP...');
        
        // Test connection first
        const connectionOk = await testSMTPConnection();
        
        if (connectionOk) {
          // Send notification to admin
          await sendContactNotificationSMTP({
            name,
            email,
            phone,
            country,
            subject,
            message,
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
