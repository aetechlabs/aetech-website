import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Build where clause
    const where: any = {
      isActive: true
    }
    
    if (type) {
      where.type = type.toUpperCase()
    }

    // Check date validity
    const now = new Date()
    where.OR = [
      { startDate: null },
      { startDate: { lte: now } }
    ]

    const banners = await prisma.banner.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    // Filter out expired banners
    const activeBanners = banners.filter(banner => {
      if (banner.endDate && new Date(banner.endDate) < now) {
        return false
      }
      return true
    })

    return NextResponse.json({
      success: true,
      data: activeBanners
    })

  } catch (error) {
    console.error('Error fetching public banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}
