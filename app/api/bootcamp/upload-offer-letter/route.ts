import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const enrollmentId = formData.get('enrollmentId') as string
    const offerLetterFile = formData.get('offerLetter') as File

    if (!enrollmentId || !offerLetterFile) {
      return NextResponse.json(
        { success: false, error: 'Missing enrollment ID or offer letter file' },
        { status: 400 }
      )
    }

    // Verify enrollment exists
    const enrollment = await prisma.bootcampEnrollment.findUnique({
      where: { id: enrollmentId }
    })

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Upload offer letter to Cloudinary
    const arrayBuffer = await offerLetterFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await uploadToCloudinary(buffer, {
      folder: 'bootcamp/offer-letters',
      public_id: `offer_letter_${enrollmentId}_${Date.now()}`,
      resource_type: 'auto'
    })

    // Update enrollment with offer letter URL
    const updatedEnrollment = await prisma.bootcampEnrollment.update({
      where: { id: enrollmentId },
      data: {
        offerLetterUrl: uploadResult.secure_url,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        offerLetterUrl: uploadResult.secure_url,
        enrollment: updatedEnrollment
      }
    })

  } catch (error) {
    console.error('Error uploading offer letter:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload offer letter' },
      { status: 500 }
    )
  }
}
