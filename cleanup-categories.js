const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupDuplicateCategories() {
  try {
    console.log('Starting cleanup of duplicate categories...')
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${categories.length} categories total`)
    
    // Group by name
    const nameGroups = {}
    categories.forEach(cat => {
      if (!nameGroups[cat.name]) {
        nameGroups[cat.name] = []
      }
      nameGroups[cat.name].push(cat)
    })
    
    // Find duplicates and keep only the oldest one
    for (const [name, catList] of Object.entries(nameGroups)) {
      if (catList.length > 1) {
        console.log(`Found ${catList.length} categories with name: ${name}`)
        
        // Sort by creation date to keep the oldest
        catList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        const keepCategory = catList[0]
        const duplicateCategories = catList.slice(1)
        
        console.log(`Keeping category ${keepCategory.id}, removing ${duplicateCategories.length} duplicates`)
        
        // Transfer posts to the kept category and delete duplicates
        for (const dupCat of duplicateCategories) {
          console.log(`Processing category ${dupCat.id}...`)
          
          // Transfer posts to the kept category
          const catPosts = await prisma.post.findMany({
            where: { categoryId: dupCat.id }
          })
          
          if (catPosts.length > 0) {
            console.log(`Transferring ${catPosts.length} posts to kept category`)
            await prisma.post.updateMany({
              where: { categoryId: dupCat.id },
              data: { categoryId: keepCategory.id }
            })
          }
          
          // Delete the duplicate category
          await prisma.category.delete({
            where: { id: dupCat.id }
          })
          console.log(`Deleted duplicate category ${dupCat.id}`)
        }
      }
    }
    
    console.log('Category cleanup completed successfully!')
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicateCategories()
