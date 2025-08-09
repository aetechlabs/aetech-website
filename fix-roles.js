const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixInvalidRoles() {
  try {
    console.log('Checking for invalid roles...')
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      }
    })
    
    console.log(`Found ${users.length} users`)
    
    // Check for any invalid roles and update them
    for (const user of users) {
      const validRoles = ['USER', 'ADMIN', 'AUTHOR', 'STUDENT']
      if (!validRoles.includes(user.role)) {
        console.log(`Updating invalid role '${user.role}' for user ${user.email} to 'USER'`)
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'USER' }
        })
      }
    }
    
    console.log('Role cleanup completed!')
    
  } catch (error) {
    console.error('Error during role cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixInvalidRoles()
