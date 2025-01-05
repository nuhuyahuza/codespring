import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await verifyAuth(request, 'INSTRUCTOR');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: user.id,
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

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await verifyAuth(request, 'INSTRUCTOR');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const course = await prisma.course.update({
      where: {
        id: params.courseId,
        instructorId: user.id,
      },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        thumbnail: data.thumbnail,
        price: data.price,
        duration: data.duration,
        level: data.level,
        status: data.status,
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

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await verifyAuth(request, 'INSTRUCTOR');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.course.delete({
      where: {
        id: params.courseId,
        instructorId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 