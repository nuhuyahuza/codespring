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

    // Get course lessons and completed lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: {
            id: true,
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

    // Get completed lessons
    const completedLessons = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lesson: {
          courseId,
        },
        completed: true,
      },
      select: {
        lessonId: true,
      },
    });

    const completedLessonIds = completedLessons.map(progress => progress.lessonId);
    const totalLessons = course.lessons.length;
    const totalProgress = totalLessons > 0 ? completedLessonIds.length / totalLessons : 0;

    return new Response(
      JSON.stringify({
        completedLessons: completedLessonIds,
        totalProgress,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch course progress:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch course progress' }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
    const body = await req.json();
    const { lessonId, completed } = body;

    if (!lessonId) {
      return new Response(
        JSON.stringify({ error: 'Lesson ID is required' }),
        { status: 400 }
      );
    }

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

    // Update lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed,
      },
      create: {
        userId: user.id,
        lessonId,
        completed,
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Progress updated successfully',
        progress,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update course progress:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update course progress' }),
      { status: 500 }
    );
  }
} 