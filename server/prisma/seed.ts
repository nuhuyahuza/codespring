import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseReview.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@example.com',
      password: hashedPassword,
      name: 'John Instructor',
      role: Role.INSTRUCTOR,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'Jane Student',
      role: Role.STUDENT,
    },
  });

  // Create courses
  const webDevCourse = await prisma.course.create({
    data: {
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of web development',
      price: 99.99,
      instructorId: instructor.id,
      lessons: {
        create: [
          {
            title: 'HTML Basics',
            content: 'Introduction to HTML',
            order: 1,
            videoUrl: 'https://example.com/video1',
          },
          {
            title: 'CSS Fundamentals',
            content: 'Learn CSS styling',
            order: 2,
            videoUrl: 'https://example.com/video2',
          },
        ],
      },
    },
  });

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: webDevCourse.id,
      status: 'active',
      progress: 0,
    },
  });

  // Create group
  const studyGroup = await prisma.group.create({
    data: {
      name: 'Web Dev Study Group',
      description: 'A group for web development students',
      courseId: webDevCourse.id,
      members: {
        create: [
          {
            userId: student.id,
            role: 'MEMBER',
          },
          {
            userId: instructor.id,
            role: 'ADMIN',
          },
        ],
      },
      messages: {
        create: [
          {
            content: 'Welcome to the study group!',
            userId: instructor.id,
          },
          {
            content: 'Thanks for having me!',
            userId: student.id,
          },
        ],
      },
    },
  });

  // Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'HTML Project',
      description: 'Create a simple HTML page',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      courseId: webDevCourse.id,
    },
  });

  // Create submission
  await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      userId: student.id,
      fileUrl: 'https://example.com/submission1',
      status: 'SUBMITTED',
    },
  });

  // Create course review
  await prisma.courseReview.create({
    data: {
      rating: 5,
      comment: 'Great course!',
      userId: student.id,
      courseId: webDevCourse.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 