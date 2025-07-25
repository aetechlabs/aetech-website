const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkComments() {
  try {
    console.log('Checking existing comments...');
    
    const comments = await prisma.comment.findMany({
      include: {
        author: true,
        post: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    });
    
    console.log(`Found ${comments.length} comments:`);
    comments.forEach((comment, index) => {
      console.log(`${index + 1}. Comment by ${comment.author?.name || comment.anonymousName || 'Anonymous'}`);
      console.log(`   Post: ${comment.post.title}`);
      console.log(`   Approved: ${comment.approved}`);
      console.log(`   Content: ${comment.content.substring(0, 50)}...`);
      console.log('---');
    });
    
    const posts = await prisma.post.findMany({
      include: {
        comments: {
          where: {
            approved: true,
            parentId: null
          },
          include: {
            author: true
          }
        }
      }
    });
    
    console.log('\nPosts with approved comments:');
    posts.forEach(post => {
      if (post.comments.length > 0) {
        console.log(`- ${post.title}: ${post.comments.length} approved comments`);
      }
    });
    
  } catch (error) {
    console.error('Error checking comments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkComments();
