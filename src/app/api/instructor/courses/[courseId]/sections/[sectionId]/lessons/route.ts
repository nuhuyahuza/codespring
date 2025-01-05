import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: session.user.id,
      },
      include: {
        sections: {
          where: {
            id: params.sectionId,
          },
        },
      },
    });

    if (!course || course.sections.length === 0) {
      return NextResponse.json(
        { error: 'Course or section not found' },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        type: data.type,
        content: data.content,
        duration: data.duration,
        order: data.order,
        sectionId: params.sectionId,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 