import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    const { postId, content, authorName, authorEmail, parentId } = body

    // Validate required fields
    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    let comment
    
    if (session?.user) {
      // Authenticated user comment
      comment = await prisma.comment.create({
        data: {
          content,
          post: {
            connect: { id: postId }
          },
          author: {
            connect: { id: (session.user as any).id }
          },
          parentId,
          approved: true, // Auto-approve comments from authenticated users
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      })
    } else {
      // Anonymous user comment
      if (!authorName || !authorEmail) {
        return NextResponse.json(
          { error: 'Name and email are required for anonymous comments' },
          { status: 400 }
        )
      }

      // Create anonymous comment (requires approval)
      comment = await prisma.comment.create({
        data: {
          content,
          post: {
            connect: { id: postId }
          },
          anonymousName: authorName,
          anonymousEmail: authorEmail,
          parentId,
          approved: false, // Anonymous comments require approval
        }
      })
    }

    return NextResponse.json({
      message: session?.user 
        ? 'Comment added successfully' 
        : 'Comment submitted for approval',
      comment,
      requiresApproval: !session?.user
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
