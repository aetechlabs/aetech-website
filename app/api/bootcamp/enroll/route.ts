import { NextRequest, NextResponse } from 'next/server'
import { sendEmailSMTP } from '@/lib/smtp-email'
import { prisma } from '@/lib/prisma'

interface EnrollmentData {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  educationLevel: string
  coursesInterested: string[]
  hasLaptop: string
  experience: string
  motivation: string
  heardAbout: string
}

export async function POST(request: NextRequest) {
  try {
    const data: EnrollmentData = await request.json()

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'educationLevel', 'coursesInterested', 'hasLaptop', 'motivation']
    const missingFields = requiredFields.filter(field => {
      const value = data[field as keyof EnrollmentData]
      return !value || (Array.isArray(value) && value.length === 0)
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Send confirmation email to applicant
    const applicantSubject = '🎉 Welcome to AETech DevStarter Bootcamp - Application Received!'
    const applicantHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETech DevStarter Bootcamp - Application Confirmed</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #c1272d, #dc3545); color: white; padding: 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 30px; }
        .highlight-box { background-color: #f8f9fa; border-left: 4px solid #c1272d; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .course-list { background-color: #fff8f0; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .button { display: inline-block; background-color: #c1272d; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .emoji { font-size: 1.2em; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">AETech Labs</div>
            <h1>🚀 Welcome to DevStarter Bootcamp!</h1>
            <p>Your application has been successfully submitted</p>
        </div>
        
        <div class="content">
            <p>Dear <strong>${data.firstName} ${data.lastName}</strong>,</p>
            
            <p>Congratulations! <span class="emoji">🎉</span> We've received your application for the <strong>AETech DevStarter Bootcamp</strong> and we're excited about your interest in joining our tech community!</p>
            
            <div class="highlight-box">
                <h3>📋 Application Summary</h3>
                <ul>
                    <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
                    <li><strong>Email:</strong> ${data.email}</li>
                    <li><strong>Phone:</strong> ${data.phone}</li>
                    <li><strong>Age:</strong> ${data.age}</li>
                    <li><strong>Education:</strong> ${data.educationLevel}</li>
                    <li><strong>Laptop Status:</strong> ${data.hasLaptop}</li>
                </ul>
            </div>

            <div class="course-list">
                <h3>💻 Courses You're Interested In:</h3>
                <ul>
                    ${data.coursesInterested.map(course => `<li>${course}</li>`).join('')}
                </ul>
            </div>

            <h3>🎯 What Happens Next?</h3>
            <ul>
                <li><strong>Review Process:</strong> Our team will review your application within 2-3 business days</li>
                <li><strong>Confirmation:</strong> You'll receive a confirmation email once your spot is secured</li>
                <li><strong>Pre-Bootcamp Info:</strong> We'll send you preparation materials and joining instructions</li>
                <li><strong>Community Access:</strong> You'll be added to our exclusive WhatsApp group before the bootcamp starts</li>
                <li><strong>Onboarding Day:</strong> Join us on Monday, August 12, 2025 at 11:00 AM for orientation and first class</li>
            </ul>

            <div class="highlight-box">
                <h3>📅 Important Dates</h3>
                <ul>
                    <li><strong>Registration Opens:</strong> August 8, 2025 at 12:00 AM</li>
                    <li><strong>Registration Closes:</strong> August 10, 2025 at 11:59 PM</li>
                    <li><strong>Onboarding & Classes Begin:</strong> Monday, August 12, 2025 at 11:00 AM</li>
                    <li><strong>Duration:</strong> 3 weeks (intensive program)</li>
                    <li><strong>Location:</strong> AETech Research Labs Limited, Suite 30, Es-Em Plaza, Utako, Abuja</li>
                    <li><strong>Cost:</strong> <span style="color: #28a745; font-weight: bold;">Completely FREE!</span></li>
                </ul>
            </div>

            <h3>💡 Preparation Tips</h3>
            <ul>
                <li>Ensure you have a reliable laptop (except for Graphic Design students who can use smartphones)</li>
                <li>Make sure you have a stable internet connection for online sessions and resources</li>
                <li>Join our social media channels for updates and community interaction</li>
                <li>Start familiarizing yourself with basic computer operations if you're new to tech</li>
                <li>Get excited about your tech journey! <span class="emoji">🚀</span></li>
            </ul>

            <p>If you have any questions or need to make changes to your application, please don't hesitate to reach out to us.</p>

            <p>We're looking forward to welcoming you to the AETech family and helping you kickstart your tech career!</p>

            <p>Best regards,<br>
            <strong>The AETech DevStarter Team</strong><br>
            📧 bootcamp@aetechlabs.com<br>
            📱 WhatsApp: +234 704 440 0347</p>
        </div>

        <div class="footer">
            <p><strong>AETech Labs</strong><br>
            Suite 30, Es-Em Plaza, Utako, Abuja<br>
            🌐 <a href="https://aetechlabs.com">www.aetechlabs.com</a></p>
            
            <p style="font-size: 12px; color: #888; margin-top: 15px;">
                You're receiving this email because you applied for the AETech DevStarter Bootcamp.<br>
                This is an automated confirmation - please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`

    // Send notification email to admin
    const adminSubject = `🎓 New Bootcamp Application: ${data.firstName} ${data.lastName}`
    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Bootcamp Application</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #c1272d, #dc3545); color: white; padding: 25px; text-align: center; }
        .content { padding: 30px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-item { background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #c1272d; }
        .info-label { font-weight: bold; color: #c1272d; margin-bottom: 5px; }
        .motivation-box { background-color: #fff8f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .course-list { background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
        @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 New Bootcamp Application</h1>
            <p>Received on ${currentDate}</p>
        </div>
        
        <div class="content">
            <h2>🎓 Applicant: ${data.firstName} ${data.lastName}</h2>
            
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">📧 Email</div>
                    <div>${data.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">📱 Phone</div>
                    <div>${data.phone}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">🎂 Age</div>
                    <div>${data.age} years old</div>
                </div>
                <div class="info-item">
                    <div class="info-label">🎓 Education</div>
                    <div>${data.educationLevel}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">💻 Laptop Status</div>
                    <div>${data.hasLaptop}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">📢 Heard About Us</div>
                    <div>${data.heardAbout || 'Not specified'}</div>
                </div>
            </div>

            <div class="course-list">
                <h3>💼 Courses of Interest:</h3>
                <ul>
                    ${data.coursesInterested.map(course => `<li><strong>${course}</strong></li>`).join('')}
                </ul>
            </div>

            ${data.experience ? `
            <div class="info-item" style="margin: 20px 0;">
                <div class="info-label">🔧 Previous Experience</div>
                <div>${data.experience}</div>
            </div>
            ` : ''}

            <div class="motivation-box">
                <h3>💡 Motivation:</h3>
                <p><em>"${data.motivation}"</em></p>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review the application details</li>
                <li>Send confirmation email if approved</li>
                <li>Add to bootcamp tracking system</li>
                <li>Schedule follow-up if needed</li>
            </ul>
        </div>
    </div>
</body>
</html>`

    // Save enrollment to database
    const enrollment = await prisma.bootcampEnrollment.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        age: data.age,
        educationLevel: data.educationLevel,
        coursesInterested: data.coursesInterested,
        hasLaptop: data.hasLaptop,
        experience: data.experience || '',
        motivation: data.motivation,
        heardAbout: data.heardAbout || '',
        status: 'PENDING'
      }
    })

    // Send emails
    const emailPromises = [
      // Send confirmation to applicant
      sendEmailSMTP({
        to: data.email,
        fromEmail: 'bootcamp@aetechlabs.com',
        fromName: 'AETech DevStarter Bootcamp',
        subject: applicantSubject,
        html: applicantHtml
      }),
      // Send notification to primary admin
      sendEmailSMTP({
        to: 'admin@aetechlabs.com',
        fromEmail: 'bootcamp@aetechlabs.com',
        fromName: 'AETech Bootcamp System',
        subject: adminSubject,
        html: adminHtml
      }),
      // Send copy to info email
      sendEmailSMTP({
        to: 'info@aetechlabs.com',
        fromEmail: 'bootcamp@aetechlabs.com',
        fromName: 'AETech Bootcamp System',
        subject: adminSubject,
        html: adminHtml
      })
    ]

    await Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.',
      applicationId: enrollment.id,
      enrollmentData: {
        id: enrollment.id,
        name: `${enrollment.firstName} ${enrollment.lastName}`,
        email: enrollment.email,
        status: enrollment.status,
        createdAt: enrollment.createdAt
      }
    })

  } catch (error) {
    console.error('Error processing bootcamp enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to process application. Please try again.' },
      { status: 500 }
    )
  }
}
