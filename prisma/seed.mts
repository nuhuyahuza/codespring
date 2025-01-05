import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codespring.com' },
    update: {},
    create: {
      email: 'admin@codespring.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create instructor
  const instructorPassword = await bcrypt.hash('instructor123', 10);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@codespring.com' },
    update: {},
    create: {
      email: 'instructor@codespring.com',
      name: 'John Doe',
      password: instructorPassword,
      role: UserRole.INSTRUCTOR,
    },
  });

  // Create student
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@codespring.com' },
    update: {},
    create: {
      email: 'student@codespring.com',
      name: 'Jane Smith',
      password: studentPassword,
      role: UserRole.STUDENT,
    },
  });

  // Create sample course
  const course = await prisma.course.upsert({
    where: { id: 'sample-course' },
    update: {},
    create: {
      id: 'sample-course',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
      price: 99.99,
      duration: 1800, // 30 hours
      difficulty: 'Beginner',
      tags: JSON.stringify(['web', 'html', 'css', 'javascript']),
      thumbnail: 'https://example.com/course-thumbnail.jpg',
      instructorId: instructor.id,
    },
  });

  // Create sample lessons
  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'HTML Basics',
        content: 'Introduction to HTML structure and basic elements.',
        order: 1,
        courseId: course.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'CSS Fundamentals',
        content: 'Learn about CSS selectors and styling properties.',
        order: 2,
        courseId: course.id,
      },
    }),
  ]);

  // Create sample enrollment
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      paymentStatus: 'COMPLETED',
    },
  });

  // Create sample group
  const group = await prisma.group.create({
    data: {
      name: 'Web Dev Study Group',
      courseId: course.id,
    },
  });

  // Add members to the group
  await Promise.all([
    prisma.groupMember.create({
      data: {
        userId: instructor.id,
        groupId: group.id,
      },
    }),
    prisma.groupMember.create({
      data: {
        userId: student.id,
        groupId: group.id,
      },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log('Test credentials:');
  console.log('Admin:', { email: 'admin@codespring.com', password: 'admin123' });
  console.log('Instructor:', { email: 'instructor@codespring.com', password: 'instructor123' });
  console.log('Student:', { email: 'student@codespring.com', password: 'student123' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 