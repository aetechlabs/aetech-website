import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmailSMTP } from '@/lib/smtp-email'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      // Organization Details
      organizationName,
      organizationType,
      website,
      description,
      
      // Contact Information
      contactName,
      email,
      phone,
      country,
      
      // Sponsorship Details
      tier,
      amount,
      interests,
      message,
      
      // Payment Method
      paymentMethod
    } = data

    // Validate required fields
    if (!organizationName || !contactName || !email || !tier || !amount) {
      return NextResponse.json(
        { error: 'Organization name, contact name, email, tier, and amount are required' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY', 'CUSTOM']
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Validate amount
    const amountNumber = parseInt(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create sponsorship application
    const application = await prisma.sponsor.create({
      data: {
        name: organizationName,
        description: description,
        logoUrl: null,
        websiteUrl: website || null,
        tier: tier,
        isActive: false, // Applications start as inactive until approved
        order: 999, // Put new applications at the end
        contactName,
        contactEmail: email,
        startDate: null,
        endDate: null,
        
        // New application-specific fields
        organizationType: organizationType || null,
        phone: phone || null,
        country: country || null,
        amount: amount.toString(),
        interests: interests || [],
        applicationMessage: message || null,
        paymentMethod: paymentMethod || 'bank_transfer',
        applicationStatus: 'PENDING'
      }
    })

    // Here you could also send an email notification to admins
    // and a confirmation email to the applicant
    try {
      // Send confirmation email to applicant
      await sendEmailSMTP({
        to: email,
        subject: 'Sponsorship Application Received - AETech Research Labs',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c1272d;">Thank you for your sponsorship application!</h2>
            <p>Dear ${contactName},</p>
            <p>We have received your sponsorship application for <strong>${organizationName}</strong>. Here are the details:</p>
            <ul>
              <li><strong>Tier:</strong> ${tier}</li>
              <li><strong>Amount:</strong> $${amountNumber.toLocaleString()}</li>
              <li><strong>Areas of Interest:</strong> ${interests?.join(', ') || 'Not specified'}</li>
            </ul>
            <p>Our team will review your application and get back to you within 2 business days with payment instructions and next steps.</p>
            <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:partnerships@aetechlabs.com">partnerships@aetechlabs.com</a>.</p>
            <p>Best regards,<br>The AETech Research Labs Team</p>
          </div>
        `
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the application if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Sponsorship application submitted successfully',
      applicationId: application.id
    }, { status: 201 })

  } catch (error) {
    console.error('Error submitting sponsorship application:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}
