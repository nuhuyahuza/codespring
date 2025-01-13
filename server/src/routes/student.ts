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
        instructor: {
          select: {
            id: true;
            name: true;
          };
        };
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
router.get('/', authenticateUser, async (req, res) => {
  console.log('\n=== STUDENT DASHBOARD REQUEST ===');
  console.log('Authenticated User:', req.user);
  
  try {
    const userId = req.user!.id;
    console.log('\n📊 Fetching dashboard for user:', userId);

    // First check if user has any enrollments
    const enrollmentCount = await prisma.enrollment.count({
      where: {
        userId,
        status: 'active',
      }
    });

    console.log('\n📚 Enrollment Check:');
    console.log('- Total enrollments found:', enrollmentCount);

    // Get enrolled courses with progress
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: 'active',
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

    console.log('\n📝 Raw Query Results:');
    console.log('- Number of enrollments:', enrollments.length);
    console.log('- Enrollment details:', JSON.stringify(enrollments, null, 2));

    // Transform to match client expected format
    const enrolledCourses = enrollments.map(enrollment => {
      const totalLessons = enrollment.course.lessons.length;
      const completedLessons = enrollment.course.lessons.filter(
        lesson => lesson.progress[0]?.completed
      ).length;

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      console.log(`\n📖 Processing course: ${enrollment.course.title}`);
      console.log({
        totalLessons,
        completedLessons,
        progress,
      });

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        thumbnail: enrollment.course.imageUrl,
        progress,
        instructor: {
          name: enrollment.course.instructor.name,
        },
      };
    });

    const stats = {
      totalCourses: enrolledCourses.length,
      completedCourses: enrolledCourses.filter(c => c.progress === 100).length,
      inProgressCourses: enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    };

    console.log('\n📊 Final Response:');
    console.log('- Courses:', enrolledCourses);
    console.log('- Stats:', stats);
    console.log('=== END DASHBOARD REQUEST ===\n');

    res.json({
      enrolledCourses,
      stats,
    });

  } catch (error) {
    console.error('\n❌ Error fetching student dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router; 