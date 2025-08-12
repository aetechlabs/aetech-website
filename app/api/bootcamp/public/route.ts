import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Find all enrollments for this email
    const enrollments = await prisma.bootcampEnrollment.findMany({
      where: {
        email: email
      },
      select: {
        id: true,
        status: true,
        assignedCourse: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        approvalDate: true
      },
      orderBy: { createdAt: 'desc' }
    })

    if (enrollments.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No enrollments found for this email address'
      })
    }

    return NextResponse.json({
      success: true,
      data: enrollments
    })

  } catch (error) {
    console.error('Error fetching student enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student enrollments' },
      { status: 500 }
    )
  }
}
