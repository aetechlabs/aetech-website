import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmailSMTP } from '@/lib/smtp-email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { enrollmentId, includeSchedule, includeOfferLetter, customMessage } = await request.json()

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      )
    }

    // Get enrollment details
    const enrollment = await prisma.bootcampEnrollment.findUnique({
      where: { id: enrollmentId }
    })

    if (!enrollment || enrollment.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Enrollment not found or not approved' },
        { status: 404 }
      )
    }

    // Get bootcamp settings for attachments
    const settings = await prisma.bootcampSettings.findFirst()

    const attachments = []
    
    // Add schedule if requested and available
    if (includeSchedule && settings?.currentScheduleUrl) {
      try {
        console.log('📥 Downloading schedule from:', settings.currentScheduleUrl)
        // Download the file from Cloudinary
        const response = await fetch(settings.currentScheduleUrl)
        console.log('📥 Schedule download response:', response.status, response.statusText)
        if (response.ok) {
          const buffer = await response.arrayBuffer()
          console.log('📥 Schedule buffer size:', buffer.byteLength, 'bytes')
          attachments.push({
            filename: 'Bootcamp_Schedule.pdf',
            content: Buffer.from(buffer),
            contentType: 'application/pdf'
          })
        } else {
          console.error('Failed to download schedule file:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error downloading schedule file:', error)
      }
    }

    // Add offer letter if requested and available
    if (includeOfferLetter && enrollment.offerLetterUrl) {
      try {
        console.log('📥 Downloading offer letter from:', enrollment.offerLetterUrl)
        // Download the file from Cloudinary
        const response = await fetch(enrollment.offerLetterUrl)
        console.log('📥 Offer letter download response:', response.status, response.statusText)
        if (response.ok) {
          const buffer = await response.arrayBuffer()
          console.log('📥 Offer letter buffer size:', buffer.byteLength, 'bytes')
          attachments.push({
            filename: `AETech_Bootcamp_Offer_Letter_${enrollment.firstName}_${enrollment.lastName}.pdf`,
            content: Buffer.from(buffer),
            contentType: 'application/pdf'
          })
        } else {
          console.error('Failed to download offer letter file:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Error downloading offer letter file:', error)
      }
    }

    // Generate email content
    const emailSubject = `🎉 Welcome to AETech Bootcamp - Important Documents Attached`
    
    const socialMediaInstructions = settings?.socialMediaInstructions || `
Congratulations on being accepted to the AETech Bootcamp! 🎉

Please help us spread the word by posting about your acceptance on your social media platforms and tag us:

📱 LinkedIn: @aetechlabs
🐦 X (Twitter): @aetechlabs  
📘 Facebook: @aetechlabs
🧵 Threads: @aetechlabs
📸 Instagram: @aetechlabs

Sample post:
"Excited to announce that I've been accepted into the @aetechlabs Bootcamp! Looking forward to learning cutting-edge technology skills and advancing my career. #AETechBootcamp #TechEducation #SkillsForTomorrow"

Thank you for helping us grow our community! 🚀`

    const emailContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff;">
  <!-- Clean Corporate Header -->
  <div style="background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 2px solid #e5e7eb;">
    <img src="https://aetechlabs.com/logo-dark.png" alt="AETech Research Labs" style="max-height: 60px; width: auto; height: auto; max-width: 200px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
    <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Bootcamp Admission Confirmation</h1>
    <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">AETech Research Labs Limited</p>
    <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px; font-weight: 300;">Official Enrollment Documentation</p>
  </div>
  
  <div style="background: white; padding: 30px 20px;">
    <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 20px; font-weight: 500;">
      Dear ${enrollment.firstName} ${enrollment.lastName},
    </h2>
    
    <p style="color: #4b5563; margin-bottom: 25px; font-size: 16px; line-height: 1.6;">
      Congratulations! We are pleased to confirm your acceptance into the AETech Bootcamp program. You have been selected from a competitive pool of applicants, and we're excited to support your journey in technology. This email contains important documents and information for your enrollment.
    </p>

    ${customMessage ? `
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280; margin: 25px 0;">
      <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">
        Personal Message from Our Team:
      </h4>
      <p style="margin: 0; color: #4b5563; line-height: 1.6; font-size: 14px;">${customMessage}</p>
    </div>
    ` : ''}

    <div style="background: #f9fafb; padding: 25px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
      <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; font-weight: 500;">
        Documents Included:
      </h3>
      <div style="display: block;">
        ${includeSchedule ? `
        <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="font-size: 16px; margin-right: 12px; color: #6b7280;">📅</span>
          <div style="flex: 1;">
            <strong style="color: #1f2937; font-size: 14px; font-weight: 500;">Bootcamp Schedule & Timetable</strong>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 13px;">Your complete learning roadmap and timeline</p>
          </div>
        </div>
        ` : ''}
        ${includeOfferLetter ? `
        <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="font-size: 16px; margin-right: 12px; color: #6b7280;">📜</span>
          <div style="flex: 1;">
            <strong style="color: #1f2937; font-size: 14px; font-weight: 500;">Official Offer Letter</strong>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 13px;">Your formal acceptance document</p>
          </div>
        </div>
        ` : ''}
        <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="font-size: 16px; margin-right: 12px; color: #6b7280;">💡</span>
          <div style="flex: 1;">
            <strong style="color: #1f2937; font-size: 14px; font-weight: 500;">Course Materials & Resources</strong>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 13px;">Comprehensive learning materials provided during the program</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="font-size: 16px; margin-right: 12px; color: #6b7280;">👥</span>
          <div style="flex: 1;">
            <strong style="color: #1f2937; font-size: 14px; font-weight: 500;">Exclusive Community Access</strong>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 13px;">Join our private learning community and network</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; padding: 12px 0;">
            <strong style="color: #1f2937; font-size: 14px; font-weight: 500;">Career Support & Job Placement</strong>
            <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 13px;">Professional guidance and job placement assistance upon completion</p>
          </div>
        </div>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 25px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
      <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 500;">
        Help Us Spread the Word!
      </h3>
      <p style="color: #4b5563; margin-bottom: 15px; font-size: 16px; line-height: 1.6;">
        Share your success story and help inspire others to join our tech community! Tag us on your favorite platforms:
      </p>
      
      <div style="margin: 15px 0;">
        <div style="display: block; margin: 8px 0; padding: 8px 0; color: #1f2937; font-size: 14px;">
          💼 LinkedIn: @aetechlabs
        </div>
        <div style="display: block; margin: 8px 0; padding: 8px 0; color: #1f2937; font-size: 14px;">
          🐦 X (Twitter): @aetechlabs
        </div>
        <div style="display: block; margin: 8px 0; padding: 8px 0; color: #1f2937; font-size: 14px;">
          📘 Facebook: @aetechlabs
        </div>
        <div style="display: block; margin: 8px 0; padding: 8px 0; color: #1f2937; font-size: 14px;">
          📸 Instagram: @aetechlabs
        </div>
        <div style="display: block; margin: 8px 0; padding: 8px 0; color: #1f2937; font-size: 14px;">
          🧵 Threads: @aetechlabs
        </div>
      </div>
      
      <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 15px;">
        <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;">Suggested Post:</h4>
        <div style="background: #f9fafb; padding: 12px; border-radius: 8px; color: #4b5563; line-height: 1.6; font-size: 14px;">
          "🚀 Excited to announce that I've been accepted into the @aetechlabs Bootcamp! Looking forward to learning cutting-edge technology skills and advancing my career with some of the best minds in tech. 
          
          Thank you @aetechlabs for this incredible opportunity! 
          
          #AETechBootcamp #TechEducation #SkillsForTomorrow #CodingJourney #TechCareer #LearningTech"
        </div>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 25px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
      <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; font-weight: 500;">
        Your Next Steps:
      </h4>
      <div style="display: block;">
        <div style="display: flex; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold; flex-shrink: 0;">1</span>
          <span style="line-height: 1.5; font-size: 14px; color: #4b5563;">📄 Review the attached documents carefully and save them to your device</span>
        </div>
        <div style="display: flex; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold; flex-shrink: 0;">2</span>
          <span style="line-height: 1.5; font-size: 14px; color: #4b5563;">📅 Add important dates and schedules to your calendar</span>
        </div>
        <div style="display: flex; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold; flex-shrink: 0;">3</span>
          <span style="line-height: 1.5; font-size: 14px; color: #4b5563;">💻 Prepare your learning environment and tools</span>
        </div>
        <div style="display: flex; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold; flex-shrink: 0;">4</span>
          <span style="line-height: 1.5; font-size: 14px; color: #4b5563;">👥 Join our community channels (details will follow soon)</span>
        </div>
        <div style="display: flex; align-items: flex-start; padding: 10px 0;">
          <span style="background: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold; flex-shrink: 0;">5</span>
          <span style="line-height: 1.5; font-size: 14px; color: #4b5563;">📱 Share your excitement on social media and tag us!</span>
        </div>
      </div>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 25px 0;">
      <p style="color: #4b5563; line-height: 1.6; margin: 0 0 12px 0; font-size: 16px;">
        <strong style="color: #1f2937;">📞 Need Help?</strong> If you have any questions or need assistance, our team is here to support you:
      </p>
      <div style="display: block; text-align: center;">
        <div style="display: inline-block; margin: 5px 8px; color: #1f2937; font-weight: 500; font-size: 14px;">
          📧 bootcamp@aetechlabs.com
        </div>
        <div style="display: inline-block; margin: 5px 8px; color: #1f2937; font-weight: 500; font-size: 14px;">
          📱 WhatsApp Support
        </div>
        <div style="display: inline-block; margin: 5px 8px; color: #1f2937; font-weight: 500; font-size: 14px;">
          🌐 aetechlabs.com/contact
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 20px 0;">
      <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin-bottom: 10px;">
        Welcome to the family! 🤝<br>
        <strong style="color: #1f2937; font-size: 18px;">The AETech Research Labs Team</strong>
      </p>
      <div style="margin-top: 15px;">
        <img src="https://aetechlabs.com/logo-dark.png" alt="AETech Labs" style="max-height: 40px; width: auto; opacity: 0.7; max-width: 150px;" />
      </div>
    </div>
  </div>
  
  <!-- Clean Footer -->
  <div style="background: #1f2937; color: white; text-align: center; padding: 20px; border-top: 2px solid #e5e7eb;">
    <div style="margin-bottom: 15px;">
      <img src="https://aetechlabs.com/logo-light.png" alt="AETech Research Labs" style="max-height: 35px; width: auto; margin-bottom: 12px; max-width: 150px;" />
    </div>
    
    <h3 style="color: white; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">AETech Research Labs Limited</h3>
    <p style="color: rgba(255,255,255,0.8); margin: 0 0 15px 0; font-size: 14px;">Engineering Tomorrow's Solutions</p>
    
    <div style="display: block; text-align: center; margin: 15px 0;">
      <div style="display: inline-block; color: rgba(255,255,255,0.8); font-size: 12px; margin: 3px 10px;">
        🌐 aetechlabs.com
      </div>
      <div style="display: inline-block; color: rgba(255,255,255,0.8); font-size: 12px; margin: 3px 10px;">
        📧 info@aetechlabs.com
      </div>
      <div style="display: inline-block; color: rgba(255,255,255,0.8); font-size: 12px; margin: 3px 10px;">
        📞 Contact Us
      </div>
    </div>
    
    <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; margin-top: 15px;">
      <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; line-height: 1.4;">
        © 2025 AETech Research Labs Limited. All rights reserved.<br>
        This email was sent regarding your bootcamp enrollment. Please keep this email for your records.
      </p>
    </div>
  </div>
</div>`

    // Send email with attachments
    await sendEmailSMTP({
      to: enrollment.email,
      subject: emailSubject,
      html: emailContent,
      attachments: attachments.length > 0 ? attachments : undefined
    })

    // Update enrollment record
    await prisma.bootcampEnrollment.update({
      where: { id: enrollmentId },
      data: {
        offerLetterSent: includeOfferLetter,
        scheduleSent: includeSchedule,
        socialMediaInstructionsSent: true,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Documents sent successfully',
      data: {
        attachmentsSent: attachments.length,
        emailSent: true
      }
    })

  } catch (error) {
    console.error('Error sending bootcamp documents:', error)
    return NextResponse.json(
      { error: 'Failed to send documents' },
      { status: 500 }
    )
  }
}
