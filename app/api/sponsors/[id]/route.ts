import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const sponsor = await prisma.sponsor.findUnique({
      where: { id }
    })

    if (!sponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sponsor)

  } catch (error) {
    console.error('Error fetching sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const data = await request.json()

    // Validate tier if provided
    if (data.tier) {
      const validTiers = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY']
      if (!validTiers.includes(data.tier)) {
        return NextResponse.json(
          { error: 'Invalid tier' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description || null
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl || null
    if (data.websiteUrl !== undefined) updateData.websiteUrl = data.websiteUrl || null
    if (data.tier !== undefined) updateData.tier = data.tier
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.order !== undefined) updateData.order = data.order
    if (data.contactName !== undefined) updateData.contactName = data.contactName || null
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail || null
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null
    
    updateData.updatedAt = new Date()

    // Update sponsor
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(sponsor)

  } catch (error) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.sponsor.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Sponsor deleted successfully' })

  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsor' },
      { status: 500 }
    )
  }
}
