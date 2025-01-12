import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Type definitions
type EnrollmentWithCourse = Prisma.EnrollmentGetPayload<{
  include: {
    course: {
      include: {
        lessons: {
          include: {
            progress: true;
          };
        };
      };
    };
  };
}>;

type DailyProgress = {
  hoursSpent: number;
  lessonsCompleted: number;
};

// Get student dashboard data
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.id;

    // Get enrolled courses with progress
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
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
    });

    // Calculate course progress
    const coursesWithProgress = enrollments.map((enrollment: EnrollmentWithCourse) => {
      const completedLessons = enrollment.course.lessons
        .filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed)
        .map(lesson => lesson.id);

      const totalProgress = enrollment.course.lessons.length > 0
        ? completedLessons.length / enrollment.course.lessons.length
        : 0;

      const totalTimeSpent = enrollment.course.lessons.reduce(
        (total, lesson) => total + (lesson.progress[0]?.timeSpent || 0),
        0
      );

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        instructor: enrollment.course.instructor.name,
        thumbnail: enrollment.course.imageUrl,
        progress: Math.round(totalProgress * 100),
        lastAccessedAt: enrollment.updatedAt.toISOString(),
      };
    });

    // Calculate daily progress (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lessonProgress = await prisma.lessonProgress.findMany({
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

    // Group progress by date
    const progressByDate = lessonProgress.reduce<Record<string, DailyProgress>>((acc, progress) => {
      const date = progress.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { hoursSpent: 0, lessonsCompleted: 0 };
      }
      acc[date].lessonsCompleted += progress.completed ? 1 : 0;
      acc[date].hoursSpent += progress.timeSpent / 3600; // Convert seconds to hours
      return acc;
    }, {});

    const dailyProgress = Object.entries(progressByDate).map(([date, data]) => ({
      date,
      hoursSpent: data.hoursSpent,
      lessonsCompleted: data.lessonsCompleted,
    }));

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

    // Compile dashboard data
    const dashboardData = {
      enrolledCourses: coursesWithProgress.length,
      activeCourses: coursesWithProgress.filter(c => c.progress < 100).length,
      hoursLearned: Math.round(
        lessonProgress.reduce((acc, p) => acc + p.timeSpent / 3600, 0)
      ),
      certificateCount: certificates.length,
      averageProgress: Math.round(
        coursesWithProgress.reduce((acc, c) => acc + c.progress, 0) /
          (coursesWithProgress.length || 1)
      ),
      recentCourses: coursesWithProgress
        .sort(
          (a, b) =>
            new Date(b.lastAccessedAt).getTime() -
            new Date(a.lastAccessedAt).getTime()
        )
        .slice(0, 3),
      allCourses: coursesWithProgress,
      progress: dailyProgress,
      certificates: certificates.map(cert => ({
        id: cert.id,
        courseTitle: cert.course.title,
        issueDate: cert.issueDate.toISOString(),
        credential: cert.credentialId,
      })),
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch student dashboard' });
  }
});

export default router; 