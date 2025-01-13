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
  console.log('Authenticated User:', JSON.stringify(req.user, null, 2));
  
  try {
    const userId = req.user!.id;
    console.log('\n📊 Fetching dashboard for user:', userId);

    // Get enrolled courses with progress
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        status: 'active',
      },
      include: {
        Course: {
          include: {
            User: true, // This gets the instructor details
            Lesson: {
              include: {
                LessonProgress: {
                  where: {
                    userId,
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('\n📝 Raw Query Results:');
    console.log('- Number of enrollments:', enrollments.length);
    console.log('- Enrollment details:', JSON.stringify(enrollments, null, 2));

    // Transform to match client expected format
    const enrolledCourses = enrollments.map(enrollment => {
      const totalLessons = enrollment.Course.Lesson.length;
      const completedLessons = enrollment.Course.Lesson.filter(
        lesson => lesson.LessonProgress.some(progress => progress.completed)
      ).length;

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      console.log(`\n📖 Processing course: ${enrollment.Course.title}`);
      console.log({
        totalLessons,
        completedLessons,
        progress,
      });

      return {
        id: enrollment.Course.id,
        title: enrollment.Course.title,
        thumbnail: enrollment.Course.imageUrl,
        progress,
        instructor: {
          name: enrollment.Course.User.name,
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