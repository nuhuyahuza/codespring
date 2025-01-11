import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all courses with optional featured filter
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    
    const courses = await prisma.course.findMany({
      take: featured === 'true' ? 3 : undefined,
      orderBy: [
        {
          enrollments: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ],
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create a course
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        instructorId: req.user!.id,
      },
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: req.user!.id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        price,
      },
    });

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: req.user!.id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get course content
router.get('/:id/content', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify enrollment or instructor status
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
          include: {
            progress: {
              where: {
                userId: req.user!.id,
              },
            },
          },
        },
        enrollments: {
          where: {
            userId: req.user!.id,
            paymentStatus: 'completed',
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled or is the instructor
    const isEnrolled = course.enrollments.length > 0;
    const isInstructor = course.instructor.id === req.user!.id;

    if (!isEnrolled && !isInstructor) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Format response
    const formattedLessons = course.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      completed: lesson.progress[0]?.completed || false,
    }));

    res.json({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      lessons: formattedLessons,
    });
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

// Get course progress
router.get('/:id/progress', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Get all lessons for the course
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            progress: {
              where: {
                userId: req.user!.id,
              },
            },
          },
        },
        enrollments: {
          where: {
            userId: req.user!.id,
            paymentStatus: 'completed',
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check enrollment
    if (course.enrollments.length === 0) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Calculate progress
    const completedLessons = course.lessons
      .filter(lesson => lesson.progress[0]?.completed)
      .map(lesson => lesson.id);

    const totalProgress = course.lessons.length > 0
      ? completedLessons.length / course.lessons.length
      : 0;

    res.json({
      completedLessons,
      totalProgress,
      currentLesson: course.lessons.find(lesson => !lesson.progress[0]?.completed)?.id || null,
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
});

export default router; 