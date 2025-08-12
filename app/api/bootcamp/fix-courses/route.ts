import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Find all approved students without assigned courses
    const studentsWithoutCourses = await prisma.bootcampEnrollment.findMany({
      where: {
        status: 'APPROVED',
        OR: [
          { assignedCourse: null },
          { assignedCourse: '' }
        ]
      }
    })

    console.log(`Found ${studentsWithoutCourses.length} approved students without assigned courses`)

    // Update each student with their first interested course
    const updates = []
    for (const student of studentsWithoutCourses) {
      if (student.coursesInterested && student.coursesInterested.length > 0) {
        const assignedCourse = student.coursesInterested[0] // Use first course they were interested in
        
        const updated = await prisma.bootcampEnrollment.update({
          where: { id: student.id },
          data: {
            assignedCourse: assignedCourse,
            approvalDate: student.approvalDate || new Date()
          }
        })
        
        updates.push({
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          assignedCourse: assignedCourse
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} students with assigned courses`,
      updates: updates
    })

  } catch (error) {
    console.error('Error assigning courses:', error)
    return NextResponse.json(
      { error: 'Failed to assign courses' },
      { status: 500 }
    )
  }
}
