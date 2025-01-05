import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const courseId = url.pathname.split('/')[3];

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId,
        paymentStatus: 'completed',
      },
    });

    if (!enrollment) {
      return new Response(
        JSON.stringify({ error: 'Not enrolled in this course' }),
        { status: 403 }
      );
    }

    // Fetch course with lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        instructor: {
          select: {
            name: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!course) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: course.instructor,
        },
        lessons: course.lessons,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch course content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch course content' }),
      { status: 500 }
    );
  }
} 