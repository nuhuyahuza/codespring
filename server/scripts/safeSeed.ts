import { PrismaClient } from '@prisma/client';
import { seed } from '../prisma/seed';

const prisma = new PrismaClient();

async function checkExistingData() {
  const userCount = await prisma.user.count();
  const courseCount = await prisma.course.count();
  return { userCount, courseCount };
}

async function safeSeed() {
  try {
    console.log('Checking existing data...');
    const { userCount, courseCount } = await checkExistingData();

    if (userCount > 0 || courseCount > 0) {
      console.log('Database already contains data:');
      console.log(`Users: ${userCount}`);
      console.log(`Courses: ${courseCount}`);
      console.log('Skipping seed operation.');
      return;
    }

    console.log('No existing data found. Running seed...');
    await seed();
    console.log('Seed completed successfully!');

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

safeSeed(); 