import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const courseId = url.pathname.split('/').pop();

    if (!courseId) {
      return new Response(
        JSON.stringify({ error: 'Course ID is required' }),
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        duration: true,
        difficulty: true,
        tags: true,
        thumbnail: true,
        instructor: {
          select: {
            name: true,
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

    // Parse tags from JSON string to array
    const formattedCourse = {
      ...course,
      tags: course.tags ? JSON.parse(course.tags) : [],
    };

    return new Response(JSON.stringify(formattedCourse), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch course' }),
      { status: 500 }
    );
  }
} 