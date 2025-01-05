import { Router } from 'express';
import { prisma } from '@/server/db';
import { authenticateUser } from '@/server/middleware/auth';
import { calculateProgress } from '@/server/utils/progress';
import { Request, Response } from 'express';

const router = Router();

router.get('/api/student/dashboard', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Get enrolled courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
        progress: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get learning progress for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        userId,
        updatedAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    // Get upcoming sessions
    const upcomingSessions = await prisma.liveSession.findMany({
      where: {
        enrollments: {
          some: {
            userId,
          },
        },
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        course: true,
        instructor: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    });

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        issueDate: 'desc',
      },
    });

    // Process and aggregate data
    const progressByDay = new Map<string, { hoursSpent: number; lessonsCompleted: number }>();
    progressRecords.forEach((record) => {
      const date = record.updatedAt.toISOString().split('T')[0];
      const existing = progressByDay.get(date) || { hoursSpent: 0, lessonsCompleted: 0 };
      progressByDay.set(date, {
        hoursSpent: existing.hoursSpent + (record.timeSpent || 0) / 3600, // Convert seconds to hours
        lessonsCompleted: existing.lessonsCompleted + (record.completed ? 1 : 0),
      });
    });

    const progress = Array.from(progressByDay.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    // Calculate total hours and average progress
    const totalHours = progress.reduce((sum, day) => sum + day.hoursSpent, 0);
    const averageProgress = enrollments.length
      ? enrollments.reduce((sum, enrollment) => sum + calculateProgress(enrollment.progress), 0) /
        enrollments.length
      : 0;

    const dashboardData = {
      enrolledCourses: enrollments.length,
      activeCourses: enrollments.filter((e) => e.status === 'ACTIVE').length,
      hoursLearned: Math.round(totalHours),
      certificateCount: certificates.length,
      averageProgress: Math.round(averageProgress),
      recentCourses: enrollments.slice(0, 3).map((enrollment) => ({
        id: enrollment.courseId,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
        progress: calculateProgress(enrollment.progress),
        lastAccessedAt: enrollment.updatedAt.toISOString(),
      })),
      allCourses: enrollments.map((enrollment) => ({
        id: enrollment.courseId,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
        progress: calculateProgress(enrollment.progress),
        instructor: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
        category: enrollment.course.category,
      })),
      progress,
      upcomingSessions: upcomingSessions.map((session) => ({
        id: session.id,
        courseTitle: session.course.title,
        startTime: session.startTime.toISOString(),
        duration: session.duration,
        instructor: `${session.instructor.firstName} ${session.instructor.lastName}`,
      })),
      certificates: certificates.map((cert) => ({
        id: cert.id,
        courseTitle: cert.course.title,
        issueDate: cert.issueDate.toISOString(),
        credential: cert.credentialId,
      })),
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 