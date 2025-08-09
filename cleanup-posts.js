const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupDuplicatePosts() {
  try {
    console.log('Starting cleanup of duplicate posts...')
    
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${posts.length} posts total`)
    
    // Group by slug
    const slugGroups = {}
    posts.forEach(post => {
      if (!slugGroups[post.slug]) {
        slugGroups[post.slug] = []
      }
      slugGroups[post.slug].push(post)
    })
    
    // Find duplicates and keep only the oldest one
    for (const [slug, postList] of Object.entries(slugGroups)) {
      if (postList.length > 1) {
        console.log(`Found ${postList.length} posts with slug: ${slug}`)
        
        // Sort by creation date to keep the oldest
        postList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        const keepPost = postList[0]
        const duplicatePosts = postList.slice(1)
        
        console.log(`Keeping post ${keepPost.id}, removing ${duplicatePosts.length} duplicates`)
        
        // Delete duplicate posts and their related records
        for (const dupPost of duplicatePosts) {
          console.log(`Processing post ${dupPost.id}...`)
          
          // Delete related comments
          await prisma.comment.deleteMany({
            where: { postId: dupPost.id }
          })
          
          // Delete related likes
          await prisma.postLike.deleteMany({
            where: { postId: dupPost.id }
          })
          
          // Delete the duplicate post
          await prisma.post.delete({
            where: { id: dupPost.id }
          })
          console.log(`Deleted duplicate post ${dupPost.id}`)
        }
      }
    }
    
    console.log('Posts cleanup completed successfully!')
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicatePosts()
