import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tier = searchParams.get('tier')
    const isActive = searchParams.get('isActive')
    const publicOnly = searchParams.get('public') === 'true'

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}
    
    if (tier) {
      where.tier = tier
    }
    
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    // For public API, only show active sponsors
    if (publicOnly) {
      where.isActive = true
    }

    const [sponsors, total] = await Promise.all([
      prisma.sponsor.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { tier: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: publicOnly ? 0 : skip,
        take: publicOnly ? undefined : limit,
      }),
      prisma.sponsor.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      sponsors,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    })

  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const {
      name,
      description,
      logoUrl,
      websiteUrl,
      tier,
      isActive,
      order,
      contactName,
      contactEmail,
      startDate,
      endDate
    } = data

    // Validate required fields
    if (!name || !tier) {
      return NextResponse.json(
        { error: 'Name and tier are required' },
        { status: 400 }
      )
    }

    // Validate tier
    const validTiers = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'COMMUNITY']
    if (!validTiers.includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Create sponsor
    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        description: description || null,
        logoUrl: logoUrl || null,
        websiteUrl: websiteUrl || null,
        tier,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    })

    return NextResponse.json(sponsor, { status: 201 })

  } catch (error) {
    console.error('Error creating sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsor' },
      { status: 500 }
    )
  }
}
