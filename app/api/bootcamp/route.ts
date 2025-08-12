import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmailSMTP } from '@/lib/smtp-email'
import { createEmailTemplate, approvalEmailContent, rejectionEmailContent, waitlistEmailContent } from '@/lib/email-templates'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      // Convert status to uppercase to match Prisma enum
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count
    const total = await prisma.bootcampEnrollment.count({ where })

    // Get enrollments with pagination
    const enrollments = await prisma.bootcampEnrollment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get enrollment statistics
    const stats = await prisma.bootcampEnrollment.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    const statusCounts = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      WAITLISTED: 0
    }

    stats.forEach(stat => {
      statusCounts[stat.status as keyof typeof statusCounts] = stat._count.status
    })

    return NextResponse.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: {
          total,
          ...statusCounts
        }
      }
    })

  } catch (error) {
    console.error('Error fetching bootcamp enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { enrollmentId, status, notes, selectedCourse } = await request.json()

    if (!enrollmentId || !status) {
      return NextResponse.json(
        { error: 'Enrollment ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get current enrollment details before updating
    const currentEnrollment = await prisma.bootcampEnrollment.findUnique({
      where: { id: enrollmentId }
    })

    if (!currentEnrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = { 
      status,
      updatedAt: new Date()
    }

    // If approving a student, set the assigned course
    if (status === 'APPROVED' && selectedCourse) {
      updateData.assignedCourse = selectedCourse
      updateData.approvalDate = new Date()
    }

    const updatedEnrollment = await prisma.bootcampEnrollment.update({
      where: { id: enrollmentId },
      data: updateData
    })

    // Send email notification based on status
    try {
      await sendStatusUpdateEmail(updatedEnrollment, status, notes, selectedCourse)
    } catch (emailError) {
      console.error('Error sending email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      data: updatedEnrollment
    })

  } catch (error) {
    console.error('Error updating enrollment status:', error)
    return NextResponse.json(
      { error: 'Failed to update enrollment status' },
      { status: 500 }
    )
  }
}

// Email templates and sending function
async function sendStatusUpdateEmail(enrollment: any, status: string, notes?: string, selectedCourse?: string) {
  const studentName = `${enrollment.firstName} ${enrollment.lastName}`
  
  // Define course availability status
  const courseAvailability: { [key: string]: { available: boolean, message?: string } } = {
    'Frontend Development (HTML, CSS, JavaScript, React)': { available: true },
    'Backend Development (Node.js, Python, Databases)': { available: true },
    'Full-Stack Development': { available: true },
    'Mobile App Development (React Native/Flutter)': { available: true },
    'Data Science & Analytics': { available: true },
    'UI/UX Design': { available: true },
    'Graphic Design': { 
      available: false, 
      message: 'We are currently sourcing a qualified instructor for Graphic Design. Please consider applying for UI/UX Design or Frontend Development which cover visual design principles.'
    },
    'Digital Marketing': { available: true },
    'Cybersecurity Fundamentals': { available: true }
  }
  
  let subject = ''
  let htmlBody = ''
  
  const baseTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${process.env.NEXTAUTH_URL || 'https://aetechlabs.com'}/logo-light.png" alt="AETech Research Labs" style="max-width: 200px;">
        <h1 style="color: #c1272d; margin: 20px 0;">AETech Bootcamp Application Update</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;">Dear ${studentName},</p>
      </div>
      
      <div style="padding: 20px 0;">
  `
  
  const footerTemplate = `
      </div>
      
      <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; color: #6c757d;">
        <p style="margin: 0; font-size: 14px;">
          Best regards,<br>
          <strong>AETech Research Labs Team</strong><br>
          <a href="mailto:info@aetechlabs.com" style="color: #c1272d;">info@aetechlabs.com</a><br>
          +234 704 440 0347
        </p>
        
        <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px;">
          <p style="margin: 0; font-size: 12px; color: #6c757d;">
            This is an automated message. Please do not reply to this email. 
            For questions, contact us at <a href="mailto:info@aetechlabs.com" style="color: #c1272d;">info@aetechlabs.com</a>
          </p>
        </div>
      </div>
    </div>
  `

  switch (status) {
    case 'APPROVED':
      subject = '🎉 Your AETech Bootcamp Application Has Been Approved!'
      
      // Check if selected course is available
      const courseInfo = selectedCourse ? courseAvailability[selectedCourse] : null
      const isSelectedCourseAvailable = courseInfo?.available !== false
      
      if (!isSelectedCourseAvailable && selectedCourse) {
        // Course not available - send different email
        subject = 'AETech Bootcamp Application Update - Course Selection Required'
        htmlBody = baseTemplate + `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px 0; color: #856404;">⚠️ Course Availability Update</h2>
            <p style="margin: 0;">Thank you for your interest in our bootcamp program. We have reviewed your application and would like to offer you admission, however we need to discuss your course selection.</p>
          </div>
          
          <h3 style="color: #c1272d;">📚 Course Availability Issue</h3>
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Selected Course:</strong> ${selectedCourse}</p>
            <p><strong>Status:</strong> ${courseInfo?.message || 'Currently unavailable'}</p>
          </div>
          
          <h3 style="color: #c1272d;">🔄 Alternative Options</h3>
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p>We'd love to have you in our bootcamp! Here are available alternatives:</p>
            <ul style="margin: 10px 0;">
              ${enrollment.coursesInterested
                .filter((course: string) => courseAvailability[course]?.available !== false && course !== selectedCourse)
                .map((course: string) => `<li><strong>${course}</strong></li>`).join('')}
            </ul>
          </div>
          
          <h3 style="color: #c1272d;">📋 Next Steps</h3>
          <div style="background: #cce5ff; border: 1px solid #b3d4ff; padding: 15px; border-radius: 5px;">
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Reply to this email with your preferred alternative course</li>
              <li>Or schedule a call with our admissions team to discuss options</li>
              <li>We'll confirm your new course selection within 24 hours</li>
              <li>Once confirmed, you'll receive your full admission package</li>
            </ol>
          </div>
          
          ${notes ? `
          <div style="background: #e2e3e5; border: 1px solid #c6c8ca; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Additional Information:</strong></p>
            <p style="margin: 10px 0 0 0;">${notes}</p>
          </div>
          ` : ''}
        ` + footerTemplate
      } else {
        // Standard approval email
        htmlBody = baseTemplate + `
          <div style="background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px 0; color: #155724;">✅ Congratulations! You're Accepted!</h2>
            <p style="margin: 0;">We're excited to inform you that your application for the AETech Bootcamp has been <strong>APPROVED</strong>!</p>
          </div>
          
          <h3 style="color: #c1272d;">📚 Your Selected Course</h3>
          <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p><strong>Course:</strong> ${selectedCourse || enrollment.coursesInterested[0]}</p>
            <p style="margin: 10px 0 0 0; color: #155724;">This course will provide you with comprehensive skills and hands-on experience in your chosen field.</p>
          </div>
          
          ${enrollment.coursesInterested.length > 1 && selectedCourse ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0;"><strong>Note:</strong> You applied for multiple courses. We've selected <strong>${selectedCourse}</strong> for this cohort based on availability and your background.</p>
          </div>
          ` : ''}
          
          <h3 style="color: #c1272d;">📋 Next Steps & Instructions</h3>
          <div style="background: #cce5ff; border: 1px solid #b3d4ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li><strong>Orientation Session:</strong> Join us on Monday, August 11th, 2025 at 11:00 AM via Google Meet</li>
              <li><strong>Discord Community:</strong> Join our Discord server for updates and peer interaction: <a href="https://discord.gg/zXjBjJnQ" style="color: #5865F2; text-decoration: none;">https://discord.gg/zXjBjJnQ</a></li>
              <li><strong>Learning Materials:</strong> You'll receive access to our learning platform within 24 hours</li>
              <li><strong>Hardware Requirements:</strong> ${enrollment.hasLaptop === 'yes' ? 'Great! You have a laptop. Make sure it meets our minimum requirements for online learning.' : 'Please ensure you have access to a laptop/computer with stable internet connection for online classes.'}</li>
              <li><strong>Platform Access:</strong> Google Meet and Zoom links will be shared before class sessions</li>
              <li><strong>Program Cost:</strong> The AETech DevStars Bootcamp is completely FREE with no hidden costs!</li>
            </ol>
          </div>
          
          <h3 style="color: #c1272d;">🎯 Program Details</h3>
          <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px;">
            <ul style="margin: 10px 0;">
              <li><strong>Duration:</strong> 3 weeks intensive training</li>
              <li><strong>Schedule:</strong> Tuesdays (Instruction) & Thursdays (Projects), 9:00 AM - 4:00 PM (WAT)</li>
              <li><strong>Format:</strong> Online Classes via Google Meet and Zoom</li>
              <li><strong>Requirements:</strong> Stable internet connection, laptop/computer</li>
              <li><strong>Cost:</strong> Completely FREE - No fees, no hidden costs</li>
              <li><strong>Start Date:</strong> Tuesday, August 13th, 2025</li>
            </ul>
          </div>
          
          <h3 style="color: #c1272d;">📅 Your Course Schedule</h3>
          <div style="background: #e8f4f8; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            ${(() => {
              const course = selectedCourse || enrollment.coursesInterested[0];
              const scheduleMap: { [key: string]: { tuesday: string; thursday: string } } = {
                'Data Science': {
                  tuesday: '9:00am – 10:30am (Lecture)',
                  thursday: '9:00am – 10:30am (Project Task)'
                },
                'Beginner Web Development': {
                  tuesday: '10:30am – 12:00pm (Lecture)', 
                  thursday: '10:30am – 12:00pm (Project Task)'
                },
                'Creative Programming': {
                  tuesday: '1:00pm – 2:00pm (Coding Demo)',
                  thursday: '1:00pm – 2:00pm (Interactive Project)'
                },
                'AI & Machine Learning': {
                  tuesday: '2:00pm – 3:00pm (Lecture)',
                  thursday: '2:00pm – 3:00pm (Project Work)'
                },
                'Graphic Design with Canva': {
                  tuesday: '3:00pm – 4:00pm (Design Workshop)',
                  thursday: '3:00pm – 4:00pm (Design Submission)'
                }
              };
              
              const courseSchedule = scheduleMap[course];
              if (courseSchedule) {
                return `
                  <p style="margin: 0 0 15px 0;"><strong>Your ${course} class times:</strong></p>
                  <ul style="margin: 10px 0;">
                    <li><strong>Tuesdays (Instruction Day):</strong> ${courseSchedule.tuesday}</li>
                    <li><strong>Thursdays (Project Assessment Day):</strong> ${courseSchedule.thursday}</li>
                  </ul>
                  <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-top: 15px;">
                    <p style="margin: 0; font-size: 14px;"><strong>💡 Bonus:</strong> Optional support sessions available Mondays & Wednesdays 9:00am – 11:00am for Q&A and hands-on help!</p>
                  </div>
                `;
              }
              return `<p style="margin: 0;">Course schedule will be shared with you during orientation.</p>`;
            })()}
          </div>
          
          ${notes ? `
          <div style="background: #e2e3e5; border: 1px solid #c6c8ca; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Additional Notes:</strong></p>
            <p style="margin: 10px 0 0 0;">${notes}</p>
          </div>
          ` : ''}
        ` + footerTemplate
      }
      break
      
    case 'REJECTED':
      subject = 'AETech Bootcamp Application Status Update'
      htmlBody = baseTemplate + `
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #721c24;">Application Update</h2>
          <p style="margin: 0;">Thank you for your interest in the AETech Bootcamp. After careful review, we regret to inform you that we cannot offer you a place in this cohort.</p>
        </div>
        
        <h3 style="color: #c1272d;">🔄 Future Opportunities</h3>
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0;">Don't be discouraged! Here are ways to stay connected:</p>
          <ul style="margin: 10px 0;">
            <li>Apply for our next cohort (we'll notify you when applications open)</li>
            <li>Join our free workshops and webinars</li>
            <li>Follow our blog for tech tips and industry insights</li>
            <li>Connect with us on social media for updates</li>
          </ul>
        </div>
        
        <h3 style="color: #c1272d;">💪 How to Strengthen Your Next Application</h3>
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px;">
          <ul style="margin: 10px 0;">
            <li>Build some foundational programming knowledge</li>
            <li>Complete online coding tutorials or courses</li>
            <li>Join tech communities and networking events</li>
            <li>Work on small personal projects to showcase your interest</li>
          </ul>
        </div>
        
        ${notes ? `
        <div style="background: #e2e3e5; border: 1px solid #c6c8ca; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0;"><strong>Additional Feedback:</strong></p>
          <p style="margin: 10px 0 0 0;">${notes}</p>
        </div>
        ` : ''}
      ` + footerTemplate
      break
      
    case 'WAITLISTED':
      subject = 'AETech Bootcamp Application - You\'re on Our Waitlist!'
      htmlBody = baseTemplate + `
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 15px 0; color: #856404;">⏳ You're on Our Waitlist!</h2>
          <p style="margin: 0;">Your application impressed us! While our current cohort is full, you've been placed on our priority waitlist.</p>
        </div>
        
        <h3 style="color: #c1272d;">📋 What This Means</h3>
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <ul style="margin: 10px 0;">
            <li><strong>Priority Access:</strong> You'll be first to know if spots become available</li>
            <li><strong>Next Cohort:</strong> Guaranteed consideration for our next intake</li>
            <li><strong>Stay Connected:</strong> We'll keep you updated on all developments</li>
            <li><strong>Free Resources:</strong> Access to prep materials and webinars</li>
          </ul>
        </div>
        
        <h3 style="color: #c1272d;">🎯 While You Wait</h3>
        <div style="background: #cce5ff; border: 1px solid #b3d4ff; padding: 15px; border-radius: 5px;">
          <ul style="margin: 10px 0;">
            <li>Keep building your programming skills</li>
            <li>Join our free monthly tech meetups</li>
            <li>Follow our blog for industry insights</li>
            <li>Network with our alumni community</li>
          </ul>
        </div>
        
        ${notes ? `
        <div style="background: #e2e3e5; border: 1px solid #c6c8ca; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0;"><strong>Additional Information:</strong></p>
          <p style="margin: 10px 0 0 0;">${notes}</p>
        </div>
        ` : ''}
      ` + footerTemplate
      break
      
    default:
      return // Don't send email for PENDING status
  }
  
  await sendEmailSMTP({
    to: enrollment.email,
    subject,
    html: htmlBody
  })
}
