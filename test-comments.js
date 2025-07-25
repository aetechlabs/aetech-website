const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testComments() {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: 'building-modern-web-applications-nextjs' },
      include: {
        comments: {
          where: {
            approved: true,
            parentId: { equals: null }
          },
          include: {
            author: true,
            replies: {
              where: { approved: true },
              include: { author: true }
            }
          }
        }
      }
    });
    
    console.log('Post found:', !!post);
    console.log('Comments count:', post?.comments?.length || 0);
    if (post?.comments?.length > 0) {
      console.log('First comment:', {
        id: post.comments[0].id,
        content: post.comments[0].content.substring(0, 50),
        approved: post.comments[0].approved,
        parentId: post.comments[0].parentId,
        author: post.comments[0].author?.name || post.comments[0].anonymousName
      });
    }
    
    // Also test without parentId filter
    const postWithAllComments = await prisma.post.findUnique({
      where: { slug: 'building-modern-web-applications-nextjs' },
      include: {
        comments: {
          where: { approved: true },
          include: { author: true }
        }
      }
    });
    
    console.log('All comments count:', postWithAllComments?.comments?.length || 0);
    
    // Check parentId values
    if (postWithAllComments?.comments?.length > 0) {
      postWithAllComments.comments.forEach((comment, index) => {
        console.log(`Comment ${index + 1}: parentId = ${comment.parentId} (type: ${typeof comment.parentId})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testComments();
