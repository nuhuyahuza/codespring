const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@codespring.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create instructor
    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const instructor = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'instructor@codespring.com',
        password: instructorPassword,
        role: 'INSTRUCTOR',
      },
    });

    // Create student
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'student@codespring.com',
        password: studentPassword,
        role: 'STUDENT',
      },
    });

    // Create courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Introduction to Web Development',
          description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
          price: 49.99,
          duration: 1800, // 30 hours
          imageUrl: '/courses/web-dev-intro.jpg',
          instructorId: instructor.id,
        },
      }),
      prisma.course.create({
        data: {
          title: 'React.js Fundamentals',
          description: 'Master React.js and build powerful web applications.',
          price: 79.99,
          duration: 2400, // 40 hours
          imageUrl: '/courses/react-fundamentals.jpg',
          instructorId: instructor.id,
        },
      }),
      prisma.course.create({
        data: {
          title: 'Node.js Backend Development',
          description: 'Build scalable backend services with Node.js and Express.',
          price: 69.99,
          duration: 2100, // 35 hours
          imageUrl: '/courses/nodejs-backend.jpg',
          instructorId: instructor.id,
        },
      }),
    ]);

    console.log('Database seeded successfully');
    console.log('Admin credentials:', { email: 'admin@codespring.com', password: 'admin123' });
    console.log('Instructor credentials:', { email: 'instructor@codespring.com', password: 'instructor123' });
    console.log('Student credentials:', { email: 'student@codespring.com', password: 'student123' });

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 