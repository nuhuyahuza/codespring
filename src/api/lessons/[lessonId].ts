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
    const lessonId = url.pathname.split('/').pop();

    if (!lessonId) {
      return new Response(
        JSON.stringify({ error: 'Lesson ID is required' }),
        { status: 400 }
      );
    }

    // Fetch lesson with course
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            enrollments: {
              where: {
                userId: user.id,
                paymentStatus: 'completed',
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return new Response(
        JSON.stringify({ error: 'Lesson not found' }),
        { status: 404 }
      );
    }

    // Verify enrollment
    if (!lesson.course.enrollments.length) {
      return new Response(
        JSON.stringify({ error: 'Not enrolled in this course' }),
        { status: 403 }
      );
    }

    // Return lesson without sensitive data
    const { course, ...lessonData } = lesson;
    
    return new Response(
      JSON.stringify({
        lesson: lessonData,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch lesson:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch lesson' }),
      { status: 500 }
    );
  }
} 