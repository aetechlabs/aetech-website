import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendCommentApprovedNotificationSMTP } from '@/lib/smtp-email'

// PATCH /api/comments/[id] - Update comment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { approved } = await request.json()

    const comment = await prisma.comment.update({
      where: { id },
      data: { approved },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          }
        },
        post: {
          select: {
            title: true,
            slug: true,
          }
        }
      }
    })

    // Send approval notification email if comment was approved
    if (approved && comment.post) {
      try {
        const authorEmail = comment.author?.email || comment.anonymousEmail;
        const authorName = comment.author?.name || comment.anonymousName || 'Anonymous';
        
        if (authorEmail) {
          await sendCommentApprovedNotificationSMTP({
            authorName,
            authorEmail,
            postTitle: comment.post.title,
            postSlug: comment.post.slug,
            content: comment.content
          });
          
          console.log('✅ Comment approval notification sent successfully');
        }
      } catch (emailError) {
        console.error('❌ Error sending comment approval notification:', emailError);
        // Continue without failing the update
      }
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    await prisma.comment.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
