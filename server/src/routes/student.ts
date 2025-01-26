import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Type definitions

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

router.post('/enroll', authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user!.id;

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment with required fields
    const enrollment = await prisma.enrollment.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        courseId,
        status: 'active',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Add endpoint to check enrollment status
router.get('/courses/:courseId/enrollment-status', authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    res.json({ isEnrolled: !!enrollment });
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    res.status(500).json({ error: 'Failed to check enrollment status' });
  }
});

export default router; 