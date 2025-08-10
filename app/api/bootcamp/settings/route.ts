import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Get or create bootcamp settings
    let settings = await prisma.bootcampSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.bootcampSettings.create({
        data: {
          socialMediaInstructions: `Congratulations on being accepted to the AETech Bootcamp! 🎉

Please help us spread the word by posting about your acceptance on your social media platforms and tag us:

📱 LinkedIn: @aetechlabs
🐦 X (Twitter): @aetechlabs  
📘 Facebook: @aetechlabs
🧵 Threads: @aetechlabs
📸 Instagram: @aetechlabs

Sample post:
"Excited to announce that I've been accepted into the @aetechlabs Bootcamp! Looking forward to learning cutting-edge technology skills and advancing my career. #AETechBootcamp #TechEducation #SkillsForTomorrow"

Thank you for helping us grow our community! 🚀`
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error) {
    console.error('Error fetching bootcamp settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const action = formData.get('action') as string

    if (action === 'upload_schedule') {
      const file = formData.get('schedule') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'No schedule file provided' },
          { status: 400 }
        )
      }

      // Upload to Cloudinary
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const uploadResult = await uploadToCloudinary(buffer, {
        folder: 'bootcamp/schedules',
        public_id: `schedule_${Date.now()}`,
        resource_type: 'auto'
      })

      // Update settings with new schedule URL
      let settings = await prisma.bootcampSettings.findFirst()

      if (settings) {
        settings = await prisma.bootcampSettings.update({
          where: { id: settings.id },
          data: { currentScheduleUrl: uploadResult.secure_url }
        })
      } else {
        settings = await prisma.bootcampSettings.create({
          data: { currentScheduleUrl: uploadResult.secure_url }
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          scheduleUrl: uploadResult.secure_url,
          settings
        }
      })
    }

    if (action === 'upload_offer_template') {
      const file = formData.get('offerTemplate') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'No offer letter template provided' },
          { status: 400 }
        )
      }

      // Upload to Cloudinary
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const uploadResult = await uploadToCloudinary(buffer, {
        folder: 'bootcamp/offer-templates',
        public_id: `offer_template_${Date.now()}`,
        resource_type: 'auto'
      })

      // Update settings with new offer template URL
      let settings = await prisma.bootcampSettings.findFirst()

      if (settings) {
        settings = await prisma.bootcampSettings.update({
          where: { id: settings.id },
          data: { templateOfferLetterUrl: uploadResult.secure_url }
        })
      } else {
        settings = await prisma.bootcampSettings.create({
          data: { templateOfferLetterUrl: uploadResult.secure_url }
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          offerTemplateUrl: uploadResult.secure_url,
          settings
        }
      })
    }

    if (action === 'update_settings') {
      const batchName = formData.get('batchName') as string
      const batchStartDate = formData.get('batchStartDate') as string
      const batchEndDate = formData.get('batchEndDate') as string
      const maxEnrollments = formData.get('maxEnrollments') as string
      const socialMediaInstructions = formData.get('socialMediaInstructions') as string

      // Get current settings to preserve URLs
      const currentSettings = await prisma.bootcampSettings.findFirst()
      
      // Try to find existing settings first
      let settings = await prisma.bootcampSettings.findFirst()

      if (settings) {
        // Update existing settings
        settings = await prisma.bootcampSettings.update({
          where: { id: settings.id },
          data: {
            batchName: batchName || undefined,
            batchStartDate: batchStartDate ? new Date(batchStartDate) : undefined,
            batchEndDate: batchEndDate ? new Date(batchEndDate) : undefined,
            maxEnrollments: maxEnrollments ? parseInt(maxEnrollments) : undefined,
            socialMediaInstructions: socialMediaInstructions || undefined,
          },
        })
      } else {
        // Create new settings
        settings = await prisma.bootcampSettings.create({
          data: {
            batchName: batchName || 'Default Batch',
            batchStartDate: batchStartDate ? new Date(batchStartDate) : undefined,
            batchEndDate: batchEndDate ? new Date(batchEndDate) : undefined,
            maxEnrollments: maxEnrollments ? parseInt(maxEnrollments) : 50,
            socialMediaInstructions: socialMediaInstructions || `🎉 Congratulations! You've been accepted into the AETech Labs Bootcamp!

📚 Your journey into tech starts now. We can't wait to see what amazing things you'll build.

📅 Please find your schedule and offer letter attached.

🔗 Don't forget to share the good news on social media and tag us:
- LinkedIn: @aetechlabs
- X (Twitter): @aetechlabs  
- Facebook: @aetechlabs
- Instagram: @aetechlabs
- Threads: @aetechlabs

#AETechLabs #TechBootcamp #CodingJourney #TechEducation`,
          },
        })
      }

      return NextResponse.json({
        success: true,
        data: settings
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error updating bootcamp settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
