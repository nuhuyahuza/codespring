import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: session.user.id,
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Validate course has required fields
    if (!course.title || !course.description || !course.thumbnail) {
      return NextResponse.json(
        {
          error:
            'Course must have a title, description, and thumbnail before publishing',
        },
        { status: 400 }
      );
    }

    // Validate course has at least one section with lessons
    if (
      course.sections.length === 0 ||
      course.sections.every((section) => section.lessons.length === 0)
    ) {
      return NextResponse.json(
        {
          error: 'Course must have at least one section with lessons',
        },
        { status: 400 }
      );
    }

    // Update course status to published
    const updatedCourse = await prisma.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        status: 'PUBLISHED',
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error publishing course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 