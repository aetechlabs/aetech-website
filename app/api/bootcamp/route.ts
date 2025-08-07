import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

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
      where.status = status
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

    const { enrollmentId, status, notes } = await request.json()

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

    const updatedEnrollment = await prisma.bootcampEnrollment.update({
      where: { id: enrollmentId },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

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
