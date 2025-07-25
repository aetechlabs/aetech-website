const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBlogPostAPI() {
  try {
    console.log('Testing blog post API query...');
    
    const post = await prisma.post.findUnique({
      where: {
        slug: 'building-modern-web-applications-nextjs',
        published: true,
      },
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
        comments: {
          where: {
            approved: true,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (post) {
      console.log(`Found post: ${post.title}`);
      console.log(`Comments found: ${post.comments.length}`);
      post.comments.forEach((comment, index) => {
        console.log(`${index + 1}. ${comment.author?.name || comment.anonymousName || 'Anonymous'}: ${comment.content.substring(0, 50)}...`);
      });
    } else {
      console.log('Post not found');
    }
    
  } catch (error) {
    console.error('Error testing blog post API:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBlogPostAPI();
