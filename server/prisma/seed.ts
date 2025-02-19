import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export async function seed() {
  try {
    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const instructor = await prisma.user.create({
      data: {
        id: '1',
        email: 'instructor@example.com',
        password: hashedPassword,
        name: 'John Instructor',
        role: Role.INSTRUCTOR,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const student = await prisma.user.create({
      data: {
        id: '2',
        email: 'student@example.com',
        password: hashedPassword,
        name: 'Jane Student',
        role: Role.STUDENT,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create courses
    const webDevCourse = await prisma.course.create({
      data: {
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
        price: 99.99,
        category: 'development',
        level: 'beginner',
        duration: 30.50,
        status: 'PUBLISHED',
        imageUrl: '/courses/web-dev-intro.jpg',
        thumbnail: '/courses/web-dev-thumb.jpg',
        rating: 4.50,
        learningObjectives: JSON.stringify([
          'Understand HTML5 and semantic markup',
          'Master CSS layouts and responsive design',
          'Build interactive web pages with JavaScript'
        ]),
        requirements: JSON.stringify([
          'Basic computer skills',
          'No prior programming experience needed',
          'A modern web browser'
        ]),
        instructorId: instructor.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        lessons: {
          create: [
            {
              id: '1',
              title: 'HTML Basics',
              content: 'Introduction to HTML',
              order: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              title: 'CSS Fundamentals',
              content: 'Learn CSS styling',
              order: 2,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      },
    });

    // Create enrollment
    await prisma.enrollment.create({
      data: {
        id: '1',
        userId: student.id,
        courseId: webDevCourse.id,
        status: 'active',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create group
    const studyGroup = await prisma.group.create({
      data: {
        id: '1',
        name: 'Web Dev Study Group',
        description: 'A group for web development students',
        courseId: webDevCourse.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupMembers: {
          create: [
            {
              id: '1',
              userId: student.id,
              role: 'MEMBER',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              userId: instructor.id,
              role: 'ADMIN',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        messages: {
          create: [
            {
              id: '1',
              content: 'Welcome to the study group!',
              userId: instructor.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              content: 'Thanks for having me!',
              userId: student.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      },
    });
console.log(studyGroup);
    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 