import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get student dashboard data
router.get('/dashboard/student', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get enrolled courses with instructor info
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Calculate dashboard metrics
    const enrolledCourses = enrollments.length;
    const activeCourses = enrollments.filter(e => e.progress < 100).length;
    const totalHoursLearned = enrollments.reduce((acc, e) => {
      // Assuming each course has an average duration of 2 hours multiplied by progress percentage
      const hoursForCourse = (2 * e.progress) / 100;
      return acc + hoursForCourse;
    }, 0);

    // Calculate average progress
    const averageProgress = enrollments.length > 0
      ? enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length
      : 0;

    // Format recent courses
    const recentCourses = enrollments
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(e => ({
        id: e.courseId,
        title: e.course.title,
        instructor: e.course.instructor.name,
        thumbnail: null, // Add thumbnail field to Course model if needed
        progress: e.progress,
        lastAccessedAt: e.updatedAt.toISOString(),
      }));

    // Get all lessons for progress tracking
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: {
          in: enrollments.map(e => e.courseId),
        },
      },
      include: {
        submissions: {
          where: {
            userId,
          },
        },
      },
    });

    // Calculate progress data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const submissions = await prisma.submission.findMany({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group submissions by date
    const progressByDate = submissions.reduce((acc: Record<string, { hoursSpent: number, lessonsCompleted: number }>, sub) => {
      const date = sub.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { hoursSpent: 0, lessonsCompleted: 0 };
      }
      acc[date].lessonsCompleted += 1;
      acc[date].hoursSpent += 1; // Assuming 1 hour per submission
      return acc;
    }, {});

    const progress = Object.entries(progressByDate).map(([date, data]) => ({
      date,
      ...data,
    }));

    // Format response
    const dashboardData = {
      enrolledCourses,
      activeCourses,
      hoursLearned: Math.round(totalHoursLearned * 10) / 10,
      certificateCount: 0, // Implement certificates later
      averageProgress,
      recentCourses,
      allCourses: recentCourses,
      progress,
      upcomingSessions: [], // Implement live sessions later
      certificates: [], // Implement certificates later
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 