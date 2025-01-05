import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user?.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const instructorId = session.user.id;

    // Get instructor's courses
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalStudents = courses.reduce(
      (sum, course) => sum + course._count.enrollments,
      0
    );
    const totalRevenue = courses.reduce(
      (sum, course) => sum + course._count.enrollments * course.price,
      0
    );
    const averageRating =
      courses.reduce(
        (sum, course) =>
          sum +
          course.reviews.reduce((sum, review) => sum + review.rating, 0) /
            (course.reviews.length || 1),
        0
      ) / (courses.length || 1);

    return NextResponse.json({
      courses: courses.length,
      students: totalStudents,
      revenue: totalRevenue,
      rating: averageRating,
      recentCourses: courses.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 