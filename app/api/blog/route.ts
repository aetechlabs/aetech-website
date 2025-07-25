import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import slugify from 'slugify'

// GET /api/blog - Get all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search')
    const all = searchParams.get('all') === 'true' // Admin only - get all posts

    // Check if admin wants all posts
    if (all) {
      const session = await getServerSession(authOptions)
      if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const skip = (page - 1) * limit

    const where: any = {}

    // Only filter by published if not admin requesting all
    if (!all) {
      where.published = true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (featured) {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true,
            }
          },
          _count: {
            select: {
              comments: {
                where: {
                  approved: true
                }
              }
            }
          }
        },
        orderBy: {
          publishedAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, excerpt, categoryId, tags, published, featured, coverImage, seoTitle, seoDescription } = body

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    const slug = slugify(title, { lower: true, strict: true })
    
    // Calculate reading time (assuming 200 words per minute)
    const wordCount = content.split(' ').length
    const readingTime = Math.ceil(wordCount / 200)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published || false,
        featured: featured || false,
        readingTime,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        tags: tags || [],
        authorId: session.user.id,
        categoryId,
        publishedAt: published ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
