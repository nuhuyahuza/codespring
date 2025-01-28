import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Type definitions
type CourseWithProgress = Prisma.CourseGetPayload<{
  include: {
    instructor: {
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
    enrollments: {
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
        lessons: true,
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
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
        id: crypto.randomUUID(),
        title,
        description,
        price: parseFloat(price),
        instructorId: req.user!.id,
        updatedAt: new Date(),
      },
      include: {
        instructor: {
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
            LessonProgress: userId ? {
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

    const isEnrolled = userId ? course.enrollments?.length > 0 : false;
    const isInstructor = userId ? course.instructor.id === userId : false;

    const formattedLessons = course.lessons.map((lesson, index) => ({
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
      instructor: course.instructor.id,
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
            LessonProgress: {
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

    if (!course.enrollments.length) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    const completedLessons = course.lessons
      .filter(lesson => lesson.LessonProgress.length > 0 && lesson.LessonProgress[0].completed)
      .map(lesson => lesson.id);

    const totalProgress = course.lessons.length > 0
      ? completedLessons.length / course.lessons.length
      : 0;

    const totalTimeSpent = course.lessons.reduce(
      (total, lesson) => total + (lesson.LessonProgress[0]?.timeSpent || 0),
      0
    );

    res.json({
      completedLessons,
      totalProgress,
      totalTimeSpent,
      currentLesson: course.lessons.find(lesson => !lesson.LessonProgress[0]?.completed)?.id || null,
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
        id: crypto.randomUUID(),
        userId,
        courseId: id,
        updatedAt: new Date()
      }
    });

    // Create initial progress records for all lessons
    await prisma.$transaction(
      course.lessons.map(lesson => 
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

    const formattedCourses = featuredCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.imageUrl || '/course-placeholder.jpg',
      instructor: course.instructor.name,
      enrolled: course._count.enrollments,
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
        instructor: {
          select: {
            name: true,
          },
        },
        lessons: {
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

// Add this endpoint to handle lesson progress
router.post('/:courseId/lessons/:lessonId/progress', authenticateUser, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { completed, timeSpent } = req.body;
    const userId = req.user!.id;

    console.log('Progress Update Request:', {
      courseId,
      lessonId,
      userId,
      completed,
      timeSpent
    });

    // First check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    console.log('Enrollment check:', enrollment);

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Then check if lesson exists and belongs to the course
    const lesson = await prisma.lesson.findFirst({
      where: { 
        id: lessonId,
        courseId,
      },
    });

    console.log('Lesson check:', lesson);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed,
        timeSpent: {
          increment: timeSpent,
        },
        updatedAt: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        userId,
        lessonId,
        completed,
        timeSpent,
        updatedAt: new Date(),
      },
    });

    console.log('Progress updated:', progress);
    res.json(progress);
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({ error: 'Failed to update lesson progress' });
  }
});

export default router; 