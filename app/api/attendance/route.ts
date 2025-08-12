import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmailSMTP } from '@/lib/smtp-email'

// GET - Fetch attendance sessions (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const includeResponses = searchParams.get('includeResponses') === 'true'

    const skip = (page - 1) * limit

    const sessions = await prisma.attendanceSession.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: {
        // Optionally filter out sessions without course (legacy data)
        // course: { not: null }
      },
      include: {
        responses: includeResponses ? {
          orderBy: { submittedAt: 'desc' }
        } : false,
        _count: {
          select: {
            responses: true
          }
        }
      }
    })

    const total = await prisma.attendanceSession.count()
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    })

  } catch (error) {
    console.error('Error fetching attendance sessions:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch attendance sessions' },
      { status: 500 }
    )
  }
}

// POST - Create new attendance session (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { title, description, course, question, correctAnswer, meetingDate, expiresAt, sendEmail } = await request.json()

    if (!title || !course || !question || !correctAnswer || !meetingDate || !expiresAt) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: title, course, question, correctAnswer, meetingDate, expiresAt' },
        { status: 400 }
      )
    }

    // Create attendance session
    const attendanceSession = await prisma.attendanceSession.create({
      data: {
        title,
        description,
        course,
        question,
        correctAnswer,
        meetingDate: new Date(meetingDate),
        expiresAt: new Date(expiresAt),
        emailSent: false
      }
    })

    // If sendEmail is true, send emails to approved students for this specific course
    if (sendEmail) {
      const approvedStudents = await prisma.bootcampEnrollment.findMany({
        where: { 
          status: 'APPROVED',
          assignedCourse: course
        },
        select: { email: true, firstName: true, lastName: true, assignedCourse: true }
      })

      console.log('Sending emails to approved students...', { 
        course: course,
        studentCount: approvedStudents.length,
        sessionId: attendanceSession.id 
      })

      const attendanceUrl = `${process.env.NEXTAUTH_URL}/attendance/${attendanceSession.id}`
      
      for (const student of approvedStudents) {
        const emailContent = `
Hi ${student.firstName},

Thank you for attending today's ${course} session: "${title}"

To mark your attendance, please answer the following question and submit it through our attendance portal:

📝 Attendance Question: ${question}

🔗 Submit your answer here: ${attendanceUrl}

⏰ Deadline: ${new Date(expiresAt).toLocaleString()}

This is to confirm your participation in today's meeting. Please submit your response before the deadline.

Best regards,
AETech Team
        `.trim()

        try {
          console.log(`Sending email to ${student.email}...`)
          await sendEmailSMTP({
            fromEmail: 'info@aetechlabs.com',
            fromName: 'AETech Labs',
            to: student.email,
            subject: `Attendance Required - ${title}`,
            text: emailContent,
            html: emailContent.replace(/\n/g, '<br>')
          })
          console.log(`Email sent successfully to ${student.email}`)
        } catch (emailError) {
          console.error(`Failed to send email to ${student.email}:`, emailError)
        }
      }

      // Update session to mark email as sent
      await prisma.attendanceSession.update({
        where: { id: attendanceSession.id },
        data: { emailSent: true }
      })
    }

    return NextResponse.json({
      success: true,
      data: attendanceSession
    })

  } catch (error) {
    console.error('Error creating attendance session:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create attendance session' },
      { status: 500 }
    )
  }
}

// PATCH - Update attendance session (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { sessionId, ...updateData } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }

    const updatedSession = await prisma.attendanceSession.update({
      where: { id: sessionId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: updatedSession
    })

  } catch (error) {
    console.error('Error updating attendance session:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update attendance session' },
      { status: 500 }
    )
  }
}

// DELETE - Delete attendance session (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      )
    }

    await prisma.attendanceSession.delete({
      where: { id: sessionId }
    })

    return NextResponse.json({
      success: true,
      message: 'Attendance session deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting attendance session:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete attendance session' },
      { status: 500 }
    )
  }
}
