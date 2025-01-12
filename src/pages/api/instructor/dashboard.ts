import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const instructor = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Get total number of courses
    const coursesCount = await prisma.course.count({
      where: { instructorId: user.id },
    });

    // Get total number of students enrolled in instructor's courses
    const studentsCount = await prisma.enrollment.count({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    });

    // Calculate total revenue
    const revenue = await prisma.enrollment.aggregate({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      _sum: {
        amountPaid: true,
      },
    });

    // Calculate average rating
    const ratings = await prisma.courseReview.aggregate({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      _avg: {
        rating: true,
      },
    });

    // Get recent courses
    const recentCourses = await prisma.course.findMany({
      where: { instructorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return res.status(200).json({
      courses: coursesCount,
      students: studentsCount,
      revenue: revenue._sum.amountPaid || 0,
      rating: ratings._avg.rating || 0,
      recentCourses,
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 