const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listPosts() {
  try {
    console.log('Listing all posts...');
    
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    });
    
    console.log(`Found ${posts.length} posts:`);
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (slug: ${post.slug}, published: ${post.published}, comments: ${post._count.comments})`);
    });
    
  } catch (error) {
    console.error('Error listing posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listPosts();
