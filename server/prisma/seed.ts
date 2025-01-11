import { PrismaClient, Role } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.message.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await bcryptjs.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@codespring.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const instructorPassword = await bcryptjs.hash('instructor123', 10);
  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@codespring.com',
      name: 'John Smith',
      password: instructorPassword,
      role: Role.INSTRUCTOR,
    },
  });

  const studentPassword = await bcryptjs.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      email: 'student@codespring.com',
      name: 'Jane Doe',
      password: studentPassword,
      role: Role.STUDENT,
    },
  });

  // Create courses
  const webDevCourse = await prisma.course.create({
    data: {
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
      price: 49.99,
      instructorId: instructor.id,
    },
  });

  const reactCourse = await prisma.course.create({
    data: {
      title: 'React.js Mastery',
      description: 'Master React.js and build powerful web applications.',
      price: 79.99,
      instructorId: instructor.id,
    },
  });

  // Create lessons for Web Development course
  const webDevLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Introduction to HTML',
        content: 'Learn the basics of HTML and document structure.',
        videoUrl: 'https://example.com/videos/html-intro',
        order: 1,
        courseId: webDevCourse.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'CSS Fundamentals',
        content: 'Style your web pages with CSS.',
        videoUrl: 'https://example.com/videos/css-basics',
        order: 2,
        courseId: webDevCourse.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'JavaScript Basics',
        content: 'Introduction to JavaScript programming.',
        videoUrl: 'https://example.com/videos/js-basics',
        order: 3,
        courseId: webDevCourse.id,
      },
    }),
  ]);

  // Create lessons for React course
  const reactLessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'React Components',
        content: 'Learn about React components and props.',
        videoUrl: 'https://example.com/videos/react-components',
        order: 1,
        courseId: reactCourse.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'State Management',
        content: 'Managing state in React applications.',
        videoUrl: 'https://example.com/videos/react-state',
        order: 2,
        courseId: reactCourse.id,
      },
    }),
  ]);

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: webDevCourse.id,
      progress: 33.33, // Completed 1/3 lessons
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: reactCourse.id,
      progress: 50, // Completed 1/2 lessons
    },
  });

  // Create submissions
  await prisma.submission.create({
    data: {
      content: 'My first HTML webpage submission',
      userId: student.id,
      lessonId: webDevLessons[0].id,
      grade: 95,
      feedback: 'Excellent work! Great understanding of HTML basics.',
    },
  });

  // Create study groups
  const webDevGroup = await prisma.group.create({
    data: {
      name: 'Web Dev Study Group',
      description: 'A group for discussing web development topics',
      courseId: webDevCourse.id,
    },
  });

  const reactGroup = await prisma.group.create({
    data: {
      name: 'React Learners',
      description: 'Discussion group for React.js students',
      courseId: reactCourse.id,
    },
  });

  // Add members to groups
  await prisma.groupMember.create({
    data: {
      userId: instructor.id,
      groupId: webDevGroup.id,
      role: 'admin',
    },
  });

  await prisma.groupMember.create({
    data: {
      userId: student.id,
      groupId: webDevGroup.id,
      role: 'member',
    },
  });

  // Create some messages
  await prisma.message.create({
    data: {
      content: 'Welcome to the Web Development study group!',
      userId: instructor.id,
      groupId: webDevGroup.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Thanks! Excited to learn web development!',
      userId: student.id,
      groupId: webDevGroup.id,
    },
  });

  console.log('Database has been seeded! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 