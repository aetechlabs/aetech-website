import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get attendance session details for students
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const session = await prisma.attendanceSession.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        question: true,
        meetingDate: true,
        expiresAt: true,
        isActive: true
      }
    })

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Attendance session not found' },
        { status: 404 }
      )
    }

    if (!session.isActive) {
      return NextResponse.json(
        { success: false, message: 'This attendance session is no longer active' },
        { status: 400 }
      )
    }

    if (new Date() > session.expiresAt) {
      return NextResponse.json(
        { success: false, message: 'The deadline for this attendance has passed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: session
    })

  } catch (error) {
    console.error('Error fetching attendance session:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch attendance session' },
      { status: 500 }
    )
  }
}

// POST - Submit attendance response
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { studentEmail, studentName, answer } = await request.json()

    if (!studentEmail || !studentName || !answer) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Get the attendance session
    const session = await prisma.attendanceSession.findUnique({
      where: { id }
    })

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Attendance session not found' },
        { status: 404 }
      )
    }

    if (!session.isActive) {
      return NextResponse.json(
        { success: false, message: 'This attendance session is no longer active' },
        { status: 400 }
      )
    }

    if (new Date() > session.expiresAt) {
      return NextResponse.json(
        { success: false, message: 'The deadline for this attendance has passed' },
        { status: 400 }
      )
    }

    // Verify student is approved for bootcamp
    const student = await prisma.bootcampEnrollment.findFirst({
      where: {
        email: studentEmail.toLowerCase().trim(),
        status: 'APPROVED'
      }
    })

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found or not approved for bootcamp' },
        { status: 400 }
      )
    }

    // Check if student already submitted
    const existingResponse = await prisma.attendanceResponse.findUnique({
      where: {
        sessionId_studentEmail: {
          sessionId: id,
          studentEmail: studentEmail.toLowerCase().trim()
        }
      }
    })

    if (existingResponse) {
      return NextResponse.json(
        { success: false, message: 'You have already submitted your attendance for this session' },
        { status: 400 }
      )
    }

    // Check if answer is correct (case insensitive)
    const submittedAnswer = answer.toLowerCase().trim()
    const correctAnswer = session.correctAnswer.toLowerCase().trim()
    const isCorrect = submittedAnswer === correctAnswer

    // Get client IP for tracking
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || 'unknown'

    // Create attendance response
    const response = await prisma.attendanceResponse.create({
      data: {
        sessionId: id,
        studentEmail: studentEmail.toLowerCase().trim(),
        studentName,
        submittedAnswer: answer.trim(),
        isCorrect,
        ipAddress
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        message: isCorrect 
          ? 'Attendance submitted successfully! You are marked present.' 
          : 'Attendance submitted, but your answer was incorrect. You may not be marked present.'
      }
    })

  } catch (error) {
    console.error('Error submitting attendance:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit attendance' },
      { status: 500 }
    )
  }
}
