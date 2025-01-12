import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Type definitions
type CourseWithProgress = Prisma.CourseGetPayload<{
  include: {
    instructor: true;
    lessons: {
      include: {
        progress: true;
      };
    };
    enrollments: true;
  };
}>;

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
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Format response with preview data
    res.json({
      ...course,
      lessonPreviews: course.lessons.map(l => l.title),
      _count: {
        ...course._count,
        enrolled: course._count.enrollments,
      },
      lessons: undefined, // Don't expose full lesson data
    });
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
router.get('/:id/content', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
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
            progress: userId ? {
              where: {
                userId,
              },
            } : false,
          },
        },
        enrollments: userId ? {
          where: {
            userId,
          },
        } : undefined,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled or is instructor (if user is logged in)
    const isEnrolled = userId ? course.enrollments?.length > 0 : false;
    const isInstructor = userId ? course.instructor.id === userId : false;

    // Format lessons based on enrollment status
    const formattedLessons = course.lessons.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      isPreview: index < 3, // First 3 lessons are preview
      ...(isEnrolled || isInstructor ? {
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        completed: lesson.progress?.[0]?.completed ?? false,
        timeSpent: lesson.progress?.[0]?.timeSpent ?? 0,
      } : {}),
    }));

    res.json({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      lessons: formattedLessons,
      isEnrolled,
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
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check enrollment
    if (!course.enrollments.length) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Calculate progress
    const completedLessons = course.lessons
      .filter(lesson => lesson.progress.length > 0 && lesson.progress[0].completed)
      .map(lesson => lesson.id);

    const totalProgress = course.lessons.length > 0
      ? completedLessons.length / course.lessons.length
      : 0;

    const totalTimeSpent = course.lessons.reduce(
      (total, lesson) => total + (lesson.progress[0]?.timeSpent || 0),
      0
    );

    res.json({
      completedLessons,
      totalProgress,
      totalTimeSpent,
      currentLesson: course.lessons.find(lesson => !lesson.progress[0]?.completed)?.id || null,
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
});

// Enroll in a course
router.post('/:id/enroll', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: true,
        enrollments: {
          where: {
            userId,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrollments.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        course: {
          connect: {
            id,
          },
        },
      },
    });

    // Create initial progress records for all lessons
    await prisma.$transaction(
      course.lessons.map(lesson => 
        prisma.lessonProgress.create({
          data: {
            lesson: {
              connect: {
                id: lesson.id,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
            completed: false,
            timeSpent: 0,
          },
        })
      )
    );

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

export default router; 