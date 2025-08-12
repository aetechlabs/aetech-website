import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get course filter from query params
    const { searchParams } = new URL(request.url)
    const course = searchParams.get('course')

    // Build where clause
    const whereClause: any = {
      isActive: true,
      expiresAt: {
        gte: new Date() // Only sessions that haven't expired
      },
      course: {
        not: null // Only sessions with a course assigned
      }
    }

    // Add course filter if provided
    if (course) {
      whereClause.course = course
    }

    // Fetch attendance sessions
    const sessions = await prisma.attendanceSession.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        course: true,
        question: true, // Include question so students can see what they need to answer
        meetingDate: true,
        expiresAt: true,
        isActive: true,
        // Don't include correctAnswer for security
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: sessions
    })
  } catch (error) {
    console.error('Error fetching public attendance sessions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch attendance sessions' 
      },
      { status: 500 }
    )
  }
}
