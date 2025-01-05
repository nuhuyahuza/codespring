import { Router } from 'express';
import { prisma } from '@/server/db';
import { authenticateUser } from '@/server/middleware/auth';
import { Request, Response } from 'express';
import { calculateProgress } from '@/server/utils/progress';

const router = Router();

router.get('/api/instructor/dashboard', authenticateUser, async (req: Request, res: Response) => {
  try {
    const instructorId = req.user.id;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Get courses
    const courses = await prisma.course.findMany({
      where: {
        instructorId,
      },
      include: {
        enrollments: true,
        reviews: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get sessions
    const sessions = await prisma.liveSession.findMany({
      where: {
        instructorId,
        startTime: {
          gte: today,
        },
      },
      include: {
        course: true,
        enrollments: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Get students
    const students = await prisma.user.findMany({
      where: {
        enrollments: {
          some: {
            course: {
              instructorId,
            },
          },
        },
      },
      include: {
        enrollments: {
          include: {
            course: true,
            progress: true,
          },
        },
      },
    });

    // Get enrollments for the last 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId,
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Process and aggregate data
    const enrollmentsByDay = new Map<string, number>();
    const revenueByDay = new Map<string, number>();
    const ratingsByDay = new Map<string, { sum: number; count: number }>();

    enrollments.forEach((enrollment) => {
      const date = enrollment.createdAt.toISOString().split('T')[0];
      enrollmentsByDay.set(date, (enrollmentsByDay.get(date) || 0) + 1);
      revenueByDay.set(
        date,
        (revenueByDay.get(date) || 0) + (enrollment.amountPaid || 0)
      );
    });

    courses.forEach((course) => {
      course.reviews.forEach((review) => {
        const date = review.createdAt.toISOString().split('T')[0];
        const existing = ratingsByDay.get(date) || { sum: 0, count: 0 };
        ratingsByDay.set(date, {
          sum: existing.sum + review.rating,
          count: existing.count + 1,
        });
      });
    });

    // Calculate total revenue
    const totalRevenue = Array.from(revenueByDay.values()).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // Calculate revenue this month
    const revenueThisMonth = enrollments
      .filter((e) => e.createdAt >= startOfMonth)
      .reduce((sum, e) => sum + (e.amountPaid || 0), 0);

    const dashboardData = {
      totalCourses: courses.length,
      activeCourses: courses.filter((c) => c.status === 'PUBLISHED').length,
      totalStudents: students.length,
      newStudentsThisMonth: enrollments.filter((e) => e.createdAt >= startOfMonth)
        .length,
      upcomingSessions: sessions.filter((s) => s.startTime <= sevenDaysFromNow)
        .length,
      totalRevenue,
      revenueThisMonth,
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        category: course.category,
        price: course.price,
        enrollmentCount: course.enrollments.length,
        rating:
          course.reviews.reduce((sum, review) => sum + review.rating, 0) /
            course.reviews.length || 0,
        status: course.status,
        lastUpdated: course.updatedAt.toISOString(),
      })),
      sessions: sessions.map((session) => ({
        id: session.id,
        courseTitle: session.course.title,
        startTime: session.startTime.toISOString(),
        duration: session.duration,
        enrolledStudents: session.enrollments.length,
        status: session.status,
      })),
      students: students.map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        enrolledCourses: student.enrollments.length,
        averageProgress:
          student.enrollments.reduce(
            (sum, enrollment) => sum + calculateProgress(enrollment.progress),
            0
          ) / student.enrollments.length,
        lastActive: student.lastActiveAt.toISOString(),
      })),
      recentActivity: {
        enrollments: Array.from(enrollmentsByDay.entries())
          .slice(-7)
          .map(([date, count]) => ({ date, count })),
        revenue: Array.from(revenueByDay.entries())
          .slice(-7)
          .map(([date, amount]) => ({ date, amount })),
        ratings: Array.from(ratingsByDay.entries())
          .slice(-7)
          .map(([date, { sum, count }]) => ({
            date,
            average: count > 0 ? sum / count : 0,
            count,
          })),
      },
      analytics: {
        enrollments: Array.from(enrollmentsByDay.entries()).map(([date, count]) => ({
          date,
          count,
        })),
        revenue: Array.from(revenueByDay.entries()).map(([date, amount]) => ({
          date,
          amount,
        })),
        ratings: Array.from(ratingsByDay.entries()).map(([date, { sum, count }]) => ({
          date,
          average: count > 0 ? sum / count : 0,
          count,
        })),
      },
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching instructor dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 