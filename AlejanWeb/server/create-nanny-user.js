const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createNannyUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('12345678', 10);
    
    // Create the nanny user
    const user = await prisma.users.create({
      data: {
        email: 'nanny6@gmail.com',
        password: hashedPassword,
        username: 'nanny1',
        contactNumber: '+1234567890',
        role: 'NANNY'
      }
    });
    
    console.log('Nanny user created successfully:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('User with this email already exists');
      
      // Try to update the existing user's role to NANNY
      const updatedUser = await prisma.users.update({
        where: { email: 'nanny1@gmail.com' },
        data: { 
          role: 'NANNY',
          password: await bcrypt.hash('12345678', 10)
        }
      });
      
      console.log('User updated to NANNY role:', updatedUser);
    } else {
      console.error('Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createNannyUser();
