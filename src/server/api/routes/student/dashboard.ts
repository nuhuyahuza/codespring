import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '@/server/middleware/auth';
import { calculateProgress } from '@/server/utils/progress';

const router = Router();
const prisma = new PrismaClient();

router.get('/student/dashboard', authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;

    // Get enrolled courses
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        paymentStatus: 'COMPLETED',
      },
      include: {
        course: {
          include: {
            instructor: true,
            lessons: {
              include: {
                progress: {
                  where: {
                    userId,
                  },
                },
              },
            },
          },
        },
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
        startTime: {
          gte: new Date(),
        },
        course: {
          enrollments: {
            some: {
              userId,
            },
          },
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
        hoursSpent: existing.hoursSpent + (record.timeSpent || 0) / 3600,
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
      ? enrollments.reduce((sum, enrollment) => {
          const totalLessons = enrollment.course.lessons.length;
          const completedLessons = enrollment.course.lessons.filter(
            (lesson) => lesson.progress.length > 0 && lesson.progress[0].completed
          ).length;
          return sum + (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);
        }, 0) / enrollments.length
      : 0;

    const dashboardData = {
      enrolledCourses: enrollments.length,
      activeCourses: enrollments.filter((e) => e.paymentStatus === 'COMPLETED').length,
      hoursLearned: Math.round(totalHours),
      certificateCount: certificates.length,
      averageProgress: Math.round(averageProgress),
      recentCourses: enrollments.slice(0, 3).map((enrollment) => ({
        id: enrollment.courseId,
        title: enrollment.course.title,
        thumbnail: enrollment.course.imageUrl,
        progress: calculateProgress(enrollment.course.lessons.flatMap(lesson => lesson.progress)),
        lastAccessedAt: enrollment.updatedAt.toISOString(),
      })),
      allCourses: enrollments.map((enrollment) => ({
        id: enrollment.courseId,
        title: enrollment.course.title,
        thumbnail: enrollment.course.imageUrl,
        progress: calculateProgress(enrollment.course.lessons.flatMap(lesson => lesson.progress)),
        instructor: enrollment.course.instructor.name,
      })),
      progress,
      upcomingSessions: upcomingSessions.map((session) => ({
        id: session.id,
        courseTitle: session.course.title,
        startTime: session.startTime.toISOString(),
        duration: session.duration,
        instructor: session.instructor.name,
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