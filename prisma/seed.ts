import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Starting database seed...');
    
    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    console.log('Creating users...');
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'Admin User',
        role: Role.ADMIN,
      },
    });

    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const instructor = await prisma.user.create({
      data: {
        email: 'instructor@example.com',
        password: instructorPassword,
        name: 'John Instructor',
        role: Role.INSTRUCTOR,
      },
    });

    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.user.create({
      data: {
        email: 'student@example.com',
        password: studentPassword,
        name: 'Alice Student',
        role: Role.STUDENT,
      },
    });

    console.log('Creating courses...');
    // Create courses
    const webDevCourse = await prisma.course.create({
      data: {
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
        price: 99.99,
        category: 'development',
        level: 'beginner',
        duration: 30,
        imageUrl: '/courses/web-dev-intro.jpg',
        instructorId: instructor.id,
        lessons: {
          create: [
            {
              title: 'Introduction to HTML',
              content: 'Learn the basics of HTML markup language.',
              order: 1,
              videoUrl: 'https://example.com/html-intro.mp4',
            },
            {
              title: 'CSS Styling',
              content: 'Master CSS styling techniques.',
              order: 2,
              videoUrl: 'https://example.com/css-basics.mp4',
            },
          ],
        },
      },
    });

    console.log('Creating enrollments...');
    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: webDevCourse.id,
        status: 'active',
        progress: 0.25,
      },
    });

    // Create course review
    await prisma.courseReview.create({
      data: {
        rating: 4.5,
        comment: 'Great course for beginners!',
        userId: student.id,
        courseId: webDevCourse.id,
      },
    });

    console.log('Creating study group...');
    // Create study group
    const webDevGroup = await prisma.group.create({
      data: {
        name: 'Web Dev Study Group',
        description: 'A group for web development students',
        courseId: webDevCourse.id,
        members: {
          create: [
            {
              userId: instructor.id,
              role: 'admin',
            },
            {
              userId: student.id,
              role: 'member',
            },
          ],
        },
      },
    });

    console.log('Creating messages...');
    // Create messages
    await prisma.message.create({
      data: {
        content: 'Welcome to the Web Development study group!',
        userId: instructor.id,
        groupId: webDevGroup.id,
      },
    });

    console.log('Database seeded successfully!');
    console.log('Test credentials:');
    console.log('Admin:', { email: 'admin@example.com', password: 'admin123' });
    console.log('Instructor:', { email: 'instructor@example.com', password: 'instructor123' });
    console.log('Student:', { email: 'student@example.com', password: 'student123' });
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 