import { NextRequest, NextResponse } from 'next/server'
import { sendEmailSMTP } from '@/lib/smtp-email'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      name,
      email,
      phone,
      experience,
      interests,
      availability,
      motivation,
      skills,
      previousVolunteering
    } = data

    // Validate required fields
    if (!name || !email || !experience || !motivation || !availability) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    const volunteer = await prisma.volunteer.create({
      data: {
        name,
        email,
        phone: phone || null,
        experience,
        interests: interests || [],
        availability,
        motivation,
        skills: skills || null,
        previousVolunteering: previousVolunteering || null,
        status: 'PENDING'
      }
    })

    // Email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c1272d; color: white; padding: 20px; text-align: center;">
          <h1>New Volunteer Application</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2 style="color: #c1272d;">Applicant Information</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Personal Details</h3>
            <p><strong>Application ID:</strong> ${volunteer.id}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Availability:</strong> ${availability}</p>
          </div>

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Areas of Interest</h3>
            <p>${interests && interests.length > 0 ? interests.join(', ') : 'None specified'}</p>
          </div>

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Experience</h3>
            <p style="white-space: pre-wrap;">${experience}</p>
          </div>

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Motivation</h3>
            <p style="white-space: pre-wrap;">${motivation}</p>
          </div>

          ${skills ? `
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Skills & Technologies</h3>
            <p style="white-space: pre-wrap;">${skills}</p>
          </div>
          ` : ''}

          ${previousVolunteering ? `
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Previous Volunteering Experience</h3>
            <p style="white-space: pre-wrap;">${previousVolunteering}</p>
          </div>
          ` : ''}
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center;">
          <p>Review this application at: <a href="https://aetechlabs.com/admin/volunteers" style="color: #c1272d;">Admin Dashboard</a></p>
        </div>
      </div>
    `

    // Confirmation email to applicant
    const applicantEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #c1272d; color: white; padding: 20px; text-align: center;">
          <h1>Thank You for Your Interest!</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #c1272d;">Dear ${name},</h2>
          
          <p>Thank you for your interest in volunteering with AETech Research Labs Limited! We're excited about the possibility of having you join our mission to democratize technology education.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #c1272d;">What happens next?</h3>
            <ul>
              <li>Our team will review your application within 48 hours</li>
              <li>We'll contact you via email to schedule a brief interview</li>
              <li>If selected, we'll provide orientation and training materials</li>
              <li>You'll be onboarded to our volunteer team and Discord community</li>
            </ul>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #c1272d;">Your Application Summary:</h3>
            <p><strong>Application ID:</strong> ${volunteer.id}</p>
            <p><strong>Areas of Interest:</strong> ${interests && interests.length > 0 ? interests.join(', ') : 'General volunteering'}</p>
            <p><strong>Availability:</strong> ${availability}</p>
          </div>
          
          <p>If you have any questions while you wait, feel free to reply to this email or contact us directly.</p>
          
          <p>Thank you for wanting to make a difference!</p>
          
          <p style="margin-top: 30px;">
            <strong>The AETech Team</strong><br>
            Advanced Engineering Technology Research Labs Limited
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center;">
          <p>Visit us at <a href="https://aetechlabs.com" style="color: #c1272d;">aetechlabs.com</a></p>
        </div>
      </div>
    `

    // Send admin notification
    await sendEmailSMTP({
      to: process.env.ADMIN_EMAIL || 'admin@aetechlabs.com',
      subject: `New Volunteer Application from ${name}`,
      html: adminEmailHtml
    })

    // Send confirmation to applicant
    await sendEmailSMTP({
      to: email,
      subject: 'Thank you for your volunteer application - AETech',
      html: applicantEmailHtml
    })

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        status: 'success',
        volunteerId: volunteer.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Volunteer application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Get total count
    const total = await prisma.volunteer.count({ where })

    // Get volunteers
    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    return NextResponse.json({
      volunteers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    )
  }
}
