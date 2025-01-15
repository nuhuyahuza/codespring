import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Type definitions
type CourseWithProgress = Prisma.CourseGetPayload<{
  include: {
    User: {
      select: {
        id: true;
        name: true;
      };
    };
    lessons: {
      include: {
        LessonProgress: {
          where: {
            userId: string;
          };
        };
      };
    };
    Enrollment: {
      where: {
        userId: string;
      };
    };
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
          createdAt: 'desc'
        }
      ],
      include: {
        User: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Enrollment: true,
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
        User: {
          select: {
            id: true,
            name: true,
          },
        },
        Lesson: {
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
            Enrollment: true,
            Lesson: true,
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
      lessonPreviews: course.Lesson.map(l => l.title),
      _count: {
        ...course._count,
        enrolled: course._count.Enrollment,
      },
      Lesson: undefined, // Don't expose full lesson data
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
        id: crypto.randomUUID(),
        title,
        description,
        price: parseFloat(price),
        instructorId: req.user!.id,
        updatedAt: new Date(),
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
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
        User: {
          select: {
            id: true,
            name: true,
          },
        },
        Lesson: {
          orderBy: {
            order: 'asc',
          },
          include: {
            LessonProgress: userId ? {
              where: {
                userId,
              },
            } : false,
          },
        },
        Enrollment: userId ? {
          where: {
            userId,
          },
        } : undefined,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isEnrolled = userId ? course.Enrollment?.length > 0 : false;
    const isInstructor = userId ? course.User.id === userId : false;

    const formattedLessons = course.Lesson.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      isPreview: index < 3,
      ...(isEnrolled || isInstructor ? {
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        completed: lesson.LessonProgress?.[0]?.completed ?? false,
        timeSpent: lesson.LessonProgress?.[0]?.timeSpent ?? 0,
      } : {}),
    }));

    res.json({
      id: course.id,
      title: course.title,
      instructor: course.User.id,
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
        Lesson: {
          include: {
            LessonProgress: {
              where: {
                userId: req.user!.id,
              },
            },
          },
        },
        Enrollment: {
          where: {
            userId: req.user!.id,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.Enrollment.length) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const completedLessons = course.Lesson
      .filter(lesson => lesson.LessonProgress.length > 0 && lesson.LessonProgress[0].completed)
      .map(lesson => lesson.id);

    const totalProgress = course.Lesson.length > 0
      ? completedLessons.length / course.Lesson.length
      : 0;

    const totalTimeSpent = course.Lesson.reduce(
      (total, lesson) => total + (lesson.LessonProgress[0]?.timeSpent || 0),
      0
    );

    res.json({
      completedLessons,
      totalProgress,
      totalTimeSpent,
      currentLesson: course.Lesson.find(lesson => !lesson.LessonProgress[0]?.completed)?.id || null,
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
        Lesson: true,
        Enrollment: {
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
    if (course.Enrollment.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        courseId: id,
        updatedAt: new Date()
      }
    });

    // Create initial progress records for all lessons
    await prisma.$transaction(
      course.Lesson.map(lesson => 
        prisma.lessonProgress.create({
          data: {
            id: crypto.randomUUID(),
            lessonId: lesson.id,
            userId,
            completed: false,
            timeSpent: 0,
            updatedAt: new Date()
          }
        })
      )
    );

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// Get featured courses
router.get('/featured', async (req, res) => {
  try {
    const featuredCourses = await prisma.course.findMany({
      take: 3,
      where: {
        status: 'PUBLISHED',
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ],
      include: {
        User: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Enrollment: true,
          },
        },
      },
    });

    const formattedCourses = featuredCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.imageUrl || '/course-placeholder.jpg',
      instructor: course.User.name,
      enrolled: course._count.Enrollment,
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({ error: 'Failed to fetch featured courses' });
  }
});

// Get course content for learning
router.get('/:id/learn', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({
      where: { 
        id,
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
        Lesson: {
          orderBy: {
            order: 'asc',
          },
          include: {
            LessonProgress: {
              where: {
                userId,
              },
              select: {
                completed: true,
                timeSpent: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: id,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ error: 'Failed to fetch course content' });
  }
});

export default router; 