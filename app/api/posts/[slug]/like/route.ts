import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = await params;
    
    // Get client IP for anonymous likes
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    let existingLike;
    
    if (session?.user?.id) {
      // Check if user already liked this post
      existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: session.user.id
          }
        }
      });
    } else {
      // Check if IP already liked this post
      existingLike = await prisma.postLike.findUnique({
        where: {
          postId_ipAddress: {
            postId: post.id,
            ipAddress: ip
          }
        }
      });
    }

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: { id: existingLike.id }
      });

      // Decrease likes count
      const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: { likes: { decrement: 1 } }
      });

      return NextResponse.json({
        liked: false,
        likes: updatedPost.likes
      });
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId: session?.user?.id || null,
          ipAddress: session?.user?.id ? null : ip
        }
      });

      // Increase likes count
      const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: { likes: { increment: 1 } }
      });

      return NextResponse.json({
        liked: true,
        likes: updatedPost.likes
      });
    }
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = await params;
    
    // Get client IP for anonymous likes
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, likes: true }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    let liked = false;
    
    if (session?.user?.id) {
      // Check if user already liked this post
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: session.user.id
          }
        }
      });
      liked = !!existingLike;
    } else {
      // Check if IP already liked this post
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_ipAddress: {
            postId: post.id,
            ipAddress: ip
          }
        }
      });
      liked = !!existingLike;
    }

    return NextResponse.json({
      liked,
      likes: post.likes
    });
  } catch (error) {
    console.error('Error getting like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
