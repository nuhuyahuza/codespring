import { Router } from 'express';
import { prisma } from '@/lib/prisma';
import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticateUser } from '@/server/middleware/auth';

const router = Router();

// Course schema validation
const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  duration: z.number().min(0, 'Duration must be non-negative'),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

type CourseCreateData = z.infer<typeof createCourseSchema>;

// Create course
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const courseData: CourseCreateData = createCourseSchema.parse(req.body);

    const course = await prisma.course.create({
      data: {
        ...courseData,
        instructorId: req.user.id,
      },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        lessons: true,
        enrollments: true,
        reviews: true,
      },
    });

    res.json(course);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    } else {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  }
});

// Get all instructor courses
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user.id,
      },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        lessons: true,
        enrollments: true,
        reviews: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const formattedCourses = courses.map(course => ({
      ...course,
      enrollmentCount: course.enrollments.length,
      averageRating: course.reviews.length 
        ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length 
        : null,
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get single course
router.get('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const courseId = req.params.id;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user.id,
      },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
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

// Update course
router.put('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const courseId = req.params.id;
    const courseData: CourseCreateData = createCourseSchema.parse(req.body);

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: courseData,
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        lessons: true,
        enrollments: true,
        reviews: true,
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    } else {
      console.error('Error updating course:', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  }
});

// Delete course
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const courseId = req.params.id;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user.id,
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router; 