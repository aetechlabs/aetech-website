import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      country,
      company,
      subject,
      message,
      projectType,
      budget,
      currency,
      timeline
    } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email notification to admin
    const emailSent = await sendEmail({
      to: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@aetechlabs.com',
      from: email,
      subject: subject || `New Contact: ${name}`,
      name,
      email,
      phone,
      country,
      company,
      message,
      projectType,
      budget,
      currency,
      timeline
    });

    if (!emailSent) {
      console.error('Failed to send contact email');
    }

    // Log the contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      country,
      company,
      subject,
      message,
      projectType,
      budget,
      currency,
      timeline,
      timestamp: new Date().toISOString(),
      emailSent
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
