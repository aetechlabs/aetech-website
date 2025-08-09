const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupDuplicateEmails() {
  try {
    console.log('Starting cleanup of duplicate emails...')
    
    // Find all users with duplicate emails
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${users.length} users total`)
    
    // Group by email
    const emailGroups = {}
    users.forEach(user => {
      if (!emailGroups[user.email]) {
        emailGroups[user.email] = []
      }
      emailGroups[user.email].push(user)
    })
    
    // Find duplicates and keep only the oldest one
    for (const [email, userList] of Object.entries(emailGroups)) {
      if (userList.length > 1) {
        console.log(`Found ${userList.length} users with email: ${email}`)
        
        // Sort by creation date to keep the oldest
        userList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        const keepUser = userList[0]
        const duplicateUsers = userList.slice(1)
        
        console.log(`Keeping user ${keepUser.id}, removing ${duplicateUsers.length} duplicates`)
        
        // Delete duplicate users and their related records
        for (const dupUser of duplicateUsers) {
          console.log(`Deleting user ${dupUser.id} and related records...`)
          
          // Delete related records first
          await prisma.postLike.deleteMany({
            where: { userId: dupUser.id }
          })
          
          await prisma.comment.deleteMany({
            where: { authorId: dupUser.id }
          })
          
          // Transfer posts to the kept user or delete them
          const userPosts = await prisma.post.findMany({
            where: { authorId: dupUser.id }
          })
          
          if (userPosts.length > 0) {
            console.log(`Transferring ${userPosts.length} posts to kept user`)
            await prisma.post.updateMany({
              where: { authorId: dupUser.id },
              data: { authorId: keepUser.id }
            })
          }
          
          // Delete sessions and accounts
          await prisma.session.deleteMany({
            where: { userId: dupUser.id }
          })
          
          await prisma.account.deleteMany({
            where: { userId: dupUser.id }
          })
          
          // Finally delete the user
          await prisma.user.delete({
            where: { id: dupUser.id }
          })
          console.log(`Deleted duplicate user ${dupUser.id}`)
        }
      }
    }
    
    console.log('Cleanup completed successfully!')
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDuplicateEmails()
