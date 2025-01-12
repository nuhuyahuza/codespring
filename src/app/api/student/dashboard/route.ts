import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { calculateProgress } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Get enrolled courses with progress
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        paymentStatus: 'COMPLETED',
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
              },
            },
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

    // Get certificates
    const certificates = await prisma.certificate.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        issueDate: 'desc',
      },
    });

    // Get upcoming live sessions
    const upcomingSessions = await prisma.liveSession.findMany({
      where: {
        startTime: {
          gte: now,
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
        course: {
          select: {
            title: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 5,
    });

    // Calculate learning progress over time
    const lessonProgress = await prisma.lessonProgress.findMany({
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

    // Process and format the data
    const formattedCourses = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.course.lessons.filter(
        (lesson) => lesson.progress.length > 0 && lesson.progress[0].completed
      ).length;
      const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        instructor: enrollment.course.instructor.name,
        thumbnail: enrollment.course.imageUrl,
        progress: Math.round(progress),
        lastAccessedAt: enrollment.updatedAt,
      };
    });

    // Calculate daily progress stats
    const progressByDay = lessonProgress.reduce((acc, progress) => {
      const date = progress.updatedAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          hoursSpent: 0,
          lessonsCompleted: 0,
        };
      }
      acc[date].hoursSpent += progress.timeSpent / 3600; // Convert to hours
      if (progress.completed) {
        acc[date].lessonsCompleted += 1;
      }
      return acc;
    }, {} as Record<string, { hoursSpent: number; lessonsCompleted: number }>);

    const progressStats = Object.entries(progressByDay).map(([date, stats]) => ({
      date,
      ...stats,
    }));

    // Compile dashboard data
    const dashboardData = {
      enrolledCourses: formattedCourses.length,
      activeCourses: formattedCourses.filter((c) => c.progress < 100).length,
      hoursLearned: Math.round(
        lessonProgress.reduce((acc, p) => acc + p.timeSpent / 3600, 0)
      ),
      certificateCount: certificates.length,
      averageProgress:
        Math.round(
          formattedCourses.reduce((acc, c) => acc + c.progress, 0) /
            (formattedCourses.length || 1)
        ),
      recentCourses: formattedCourses
        .sort(
          (a, b) =>
            new Date(b.lastAccessedAt).getTime() -
            new Date(a.lastAccessedAt).getTime()
        )
        .slice(0, 3),
      allCourses: formattedCourses,
      progress: progressStats,
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

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 