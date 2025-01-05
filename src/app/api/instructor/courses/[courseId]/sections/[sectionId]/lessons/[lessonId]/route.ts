import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: { courseId: string; sectionId: string; lessonId: string } }
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

    const lesson = await prisma.lesson.update({
      where: {
        id: params.lessonId,
        sectionId: params.sectionId,
      },
      data: {
        title: data.title,
        type: data.type,
        content: data.content,
        duration: data.duration,
        order: data.order,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: { params: { courseId: string; sectionId: string; lessonId: string } }
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

    await prisma.lesson.delete({
      where: {
        id: params.lessonId,
        sectionId: params.sectionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 