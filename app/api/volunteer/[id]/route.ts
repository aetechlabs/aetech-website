import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailSMTP } from '@/lib/smtp-email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status, notes } = await request.json()

    // Validate status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update volunteer
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: {
        status,
        notes: notes || null,
        updatedAt: new Date()
      }
    })

    // Send email notification based on status
    if (status === 'APPROVED') {
      const approvalEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #c1272d; color: white; padding: 20px; text-align: center;">
            <h1>🎉 Congratulations! You're Approved!</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #c1272d;">Dear ${volunteer.name},</h2>
            
            <p>Great news! Your volunteer application has been approved. We're thrilled to welcome you to the AETech volunteer team!</p>
            
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <h3 style="color: #2e7d32; margin: 0 0 10px 0;">Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Check your email for Discord community invitation</li>
                <li>Complete the volunteer orientation materials</li>
                <li>Schedule your first training session</li>
                <li>Connect with your team coordinator</li>
              </ul>
            </div>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #c1272d;">Your Volunteer Profile:</h3>
              <p><strong>Areas of Interest:</strong> ${volunteer.interests.join(', ')}</p>
              <p><strong>Availability:</strong> ${volunteer.availability}</p>
            </div>
            
            <p>We'll be in touch within the next 24 hours with detailed onboarding information and access to our volunteer resources.</p>
            
            <p>Thank you for joining our mission to democratize technology education!</p>
            
            <p style="margin-top: 30px;">
              <strong>The AETech Team</strong><br>
              Advanced Engineering Technology Research Labs Limited
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center;">
            <p>Questions? Reply to this email or visit <a href="https://aetechlabs.com" style="color: #c1272d;">aetechlabs.com</a></p>
          </div>
        </div>
      `

      await sendEmailSMTP({
        to: volunteer.email,
        subject: '🎉 Your AETech Volunteer Application is Approved!',
        html: approvalEmailHtml
      })
    } else if (status === 'REJECTED') {
      const rejectionEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #c1272d; color: white; padding: 20px; text-align: center;">
            <h1>Thank You for Your Interest</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #c1272d;">Dear ${volunteer.name},</h2>
            
            <p>Thank you for your interest in volunteering with AETech Research Labs Limited. We were impressed by your application and appreciate the time you took to apply.</p>
            
            <p>After careful consideration, we have decided not to move forward with your application at this time. This decision was not easy, as we received many outstanding applications.</p>
            
            <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #c1272d;">Stay Connected:</h3>
              <ul>
                <li>Follow our social media for future volunteer opportunities</li>
                <li>Consider applying for future programs that match your skills</li>
                <li>Join our community events and workshops</li>
                <li>Refer qualified friends who might be interested</li>
              </ul>
            </div>
            
            ${notes ? `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #c1272d;">Additional Notes:</h3>
              <p style="white-space: pre-wrap;">${notes}</p>
            </div>
            ` : ''}
            
            <p>We encourage you to continue pursuing your passion for technology and education. Thank you again for your interest in our mission.</p>
            
            <p style="margin-top: 30px;">
              <strong>The AETech Team</strong><br>
              Advanced Engineering Technology Research Labs Limited
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center;">
            <p>Visit us at <a href="https://aetechlabs.com" style="color: #c1272d;">aetechlabs.com</a></p>
          </div>
        </div>
      `

      await sendEmailSMTP({
        to: volunteer.email,
        subject: 'Thank you for your volunteer application - AETech',
        html: rejectionEmailHtml
      })
    }

    return NextResponse.json(volunteer)

  } catch (error) {
    console.error('Error updating volunteer:', error)
    return NextResponse.json(
      { error: 'Failed to update volunteer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.volunteer.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Volunteer deleted successfully' })

  } catch (error) {
    console.error('Error deleting volunteer:', error)
    return NextResponse.json(
      { error: 'Failed to delete volunteer' },
      { status: 500 }
    )
  }
}
