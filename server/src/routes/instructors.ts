import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/onboarding', authenticateUser, async (req, res) => {
  try {
    const data = req.body;

    const userId = req.user!.id;

    // Update user with instructor profile data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        hasCompletedOnboarding: true,
      },
    });

    res.json({
      message: 'Instructor profile completed successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding
      }
    });
  } catch (error) {
    console.error('Error in instructor onboarding:', error);
    res.status(500).json({ error: 'Failed to complete instructor profile' });
  }
});

// Get all instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await prisma.user.findMany({
      where: {
        role: 'INSTRUCTOR'
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        instructorProfile: true,
        instructedCourses: {
          select: {
            id: true,
            title: true,
            enrollments: {
              select: {
                id: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      }
    });

    // Transform the data to match the frontend interface
    const formattedInstructors = instructors.map(instructor => {
      const profile = instructor.instructorProfile as any; // Cast to any since it's stored as Json
      return {
        id: instructor.id,
        name: instructor.name,
        avatar: instructor.avatar || '',
        role: instructor.role,
        bio: profile?.bio || '',
        expertise: profile?.expertise || [],
        totalStudents: instructor.instructedCourses.reduce((acc: number, course) => acc + course.enrollments.length, 0),
        totalCourses: instructor.instructedCourses.length,
        rating: instructor.instructedCourses.reduce((acc: number, course) => {
          const courseRatings = course.reviews.map(r => r.rating);
          return courseRatings.length ? acc + (courseRatings.reduce((a: number, b: number) => a + b, 0) / courseRatings.length) : acc;
        }, 0) / (instructor.instructedCourses.length || 1),
        courses: instructor.instructedCourses.map(course => ({
          id: course.id,
          title: course.title,
          students: course.enrollments.length,
          rating: course.reviews.reduce((acc: number, r) => acc + r.rating, 0) / (course.reviews.length || 1)
        }))
      };
    });

    res.json(formattedInstructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
});



export default router; 