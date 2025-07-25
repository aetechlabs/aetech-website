const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCommentStructure() {
  try {
    // First get the post ID
    const post = await prisma.post.findUnique({
      where: { slug: 'building-modern-web-applications-nextjs' },
      select: { id: true, title: true }
    });
    
    if (!post) {
      console.log('Post not found');
      return;
    }
    
    console.log(`Post found: ${post.title} (ID: ${post.id})`);
    
    // Now check all comments for this post
    const allComments = await prisma.comment.findMany({
      where: { postId: post.id },
      include: {
        author: true
      }
    });
    
    console.log(`\nAll comments for this post: ${allComments.length}`);
    allComments.forEach((comment, index) => {
      console.log(`${index + 1}. ID: ${comment.id}`);
      console.log(`   Author: ${comment.author?.name || comment.anonymousName || 'Anonymous'}`);
      console.log(`   Approved: ${comment.approved}`);
      console.log(`   ParentId: ${comment.parentId || 'null'}`);
      console.log(`   Content: ${comment.content.substring(0, 50)}...`);
      console.log('---');
    });
    
    // Check only approved comments
    const approvedComments = await prisma.comment.findMany({
      where: { 
        postId: post.id,
        approved: true
      },
      include: {
        author: true
      }
    });
    
    console.log(`\nApproved comments: ${approvedComments.length}`);
    
    // Check only top-level approved comments
    const topLevelComments = await prisma.comment.findMany({
      where: { 
        postId: post.id,
        approved: true,
        parentId: null
      },
      include: {
        author: true
      }
    });
    
    console.log(`Top-level approved comments: ${topLevelComments.length}`);
    
  } catch (error) {
    console.error('Error checking comment structure:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCommentStructure();
