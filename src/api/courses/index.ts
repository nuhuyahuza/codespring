import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse tags from JSON string to array
    const formattedCourses = courses.map(course => ({
      ...course,
      tags: course.tags ? JSON.parse(course.tags) : [],
    }));

    return new Response(JSON.stringify(formattedCourses), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch courses',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 