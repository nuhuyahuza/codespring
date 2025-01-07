import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.message.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@codespring.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const instructor = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'instructor@codespring.com',
        password: instructorPassword,
        role: 'INSTRUCTOR',
      },
    });

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
    const webDevCourse = await prisma.course.create({
      data: {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
        price: 49.99,
        imageUrl: '/courses/web-dev-intro.jpg',
        instructorId: instructor.id,
      },
    });

    const reactCourse = await prisma.course.create({
      data: {
        title: 'React.js Fundamentals',
        description: 'Master React.js and build powerful web applications.',
        price: 79.99,
        imageUrl: '/courses/react-fundamentals.jpg',
        instructorId: instructor.id,
      },
    });

    // Create lessons
    const webDevLessons = await Promise.all([
      prisma.lesson.create({
        data: {
          title: 'HTML Fundamentals',
          content: 'Learn the basic structure of HTML documents.',
          order: 1,
          courseId: webDevCourse.id,
        },
      }),
      prisma.lesson.create({
        data: {
          title: 'CSS Styling',
          content: 'Master CSS styling techniques.',
          order: 2,
          courseId: webDevCourse.id,
        },
      }),
      prisma.lesson.create({
        data: {
          title: 'JavaScript Basics',
          content: 'Introduction to JavaScript programming.',
          order: 3,
          courseId: webDevCourse.id,
        },
      }),
    ]);

    const reactLessons = await Promise.all([
      prisma.lesson.create({
        data: {
          title: 'React Components',
          content: 'Understanding React components and props.',
          order: 1,
          courseId: reactCourse.id,
        },
      }),
      prisma.lesson.create({
        data: {
          title: 'State Management',
          content: 'Managing state in React applications.',
          order: 2,
          courseId: reactCourse.id,
        },
      }),
      prisma.lesson.create({
        data: {
          title: 'Hooks',
          content: 'Using React hooks effectively.',
          order: 3,
          courseId: reactCourse.id,
        },
      }),
    ]);

    // Create groups
    const webDevGroup = await prisma.group.create({
      data: {
        name: 'Web Dev Discussion',
        description: 'General discussion about web development',
        courseId: webDevCourse.id,
      },
    });

    const reactGroup = await prisma.group.create({
      data: {
        name: 'React Learning Community',
        description: 'Discuss React concepts and best practices',
        courseId: reactCourse.id,
      },
    });

    // Create group members
    await Promise.all([
      prisma.groupMember.create({
        data: {
          userId: instructor.id,
          groupId: webDevGroup.id,
          role: 'OWNER',
        },
      }),
      prisma.groupMember.create({
        data: {
          userId: student.id,
          groupId: webDevGroup.id,
          role: 'MEMBER',
        },
      }),
      prisma.groupMember.create({
        data: {
          userId: instructor.id,
          groupId: reactGroup.id,
          role: 'OWNER',
        },
      }),
      prisma.groupMember.create({
        data: {
          userId: student.id,
          groupId: reactGroup.id,
          role: 'MEMBER',
        },
      }),
    ]);

    // Create messages
    await Promise.all([
      prisma.message.create({
        data: {
          content: 'Welcome to the Web Development course!',
          userId: instructor.id,
          groupId: webDevGroup.id,
        },
      }),
      prisma.message.create({
        data: {
          content: 'Thanks! Excited to learn!',
          userId: student.id,
          groupId: webDevGroup.id,
        },
      }),
      prisma.message.create({
        data: {
          content: 'Welcome to the React course!',
          userId: instructor.id,
          groupId: reactGroup.id,
        },
      }),
      prisma.message.create({
        data: {
          content: 'Looking forward to learning React!',
          userId: student.id,
          groupId: reactGroup.id,
        },
      }),
    ]);

    // Create submissions
    await prisma.submission.create({
      data: {
        content: 'My first HTML assignment',
        userId: student.id,
        courseId: webDevCourse.id,
        lessonId: webDevLessons[0].id,
        status: 'GRADED',
        score: 85,
        feedback: 'Good work! Keep practicing.',
        gradedAt: new Date(),
      },
    });

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