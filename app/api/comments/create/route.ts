import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendNewCommentNotificationSMTP, sendReplyNotificationSMTP } from '@/lib/smtp-email'

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
      const commentData: any = {
        content,
        post: {
          connect: { id: postId }
        },
        author: {
          connect: { id: (session.user as any).id }
        },
        approved: true, // Auto-approve comments from authenticated users
      };

      // Add parent relation if this is a reply
      if (parentId) {
        commentData.parent = {
          connect: { id: parentId }
        };
      }

      comment = await prisma.comment.create({
        data: commentData,
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
      const commentData: any = {
        content,
        post: {
          connect: { id: postId }
        },
        anonymousName: authorName,
        anonymousEmail: authorEmail,
        approved: false, // Anonymous comments require approval
      };

      // Add parent relation if this is a reply
      if (parentId) {
        commentData.parent = {
          connect: { id: parentId }
        };
      }

      comment = await prisma.comment.create({
        data: commentData
      })
    }

    // Send email notifications
    try {
      // Get post details for email
      const postWithSlug = await prisma.post.findUnique({
        where: { id: postId },
        select: { title: true, slug: true }
      });

      if (postWithSlug) {
        // Send notification to admin about new comment/reply
        const finalAuthorName = session?.user?.name || authorName;
        const finalAuthorEmail = session?.user?.email || authorEmail;
        
        // Check if this is a reply and get parent comment details
        let isReply = false;
        let parentAuthor = '';
        let parentComment = null;

        if (parentId) {
          isReply = true;
          parentComment = await prisma.comment.findUnique({
            where: { id: parentId },
            include: {
              author: { select: { name: true, email: true } }
            }
          });
          
          if (parentComment) {
            parentAuthor = parentComment.author?.name || parentComment.anonymousName || 'Anonymous';
          }
        }

        // Send admin notification
        await sendNewCommentNotificationSMTP({
          postTitle: postWithSlug.title,
          postSlug: postWithSlug.slug,
          authorName: finalAuthorName,
          authorEmail: finalAuthorEmail,
          content,
          isReply,
          parentAuthor
        });

        // Send reply notification to original commenter (if this is a reply and we have their email)
        if (isReply && parentComment) {
          const originalEmail = parentComment.author?.email || parentComment.anonymousEmail;
          const originalName = parentComment.author?.name || parentComment.anonymousName || 'Anonymous';
          
          if (originalEmail && originalEmail !== finalAuthorEmail) {
            await sendReplyNotificationSMTP({
              originalAuthorName: originalName,
              originalAuthorEmail: originalEmail,
              replyAuthorName: finalAuthorName,
              postTitle: postWithSlug.title,
              postSlug: postWithSlug.slug,
              originalComment: parentComment.content,
              replyContent: content
            });
          }
        }

        console.log('✅ Comment email notifications sent successfully');
      }
    } catch (emailError) {
      console.error('❌ Error sending comment email notifications:', emailError);
      // Continue without failing the comment creation
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
