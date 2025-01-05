import { Router } from 'express';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';
import { Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  price: z.number().min(0, 'Price must be non-negative'),
  duration: z.number().min(0, 'Duration must be non-negative'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
});

router.post('/api/instructor/courses', authenticateUser, async (req: Request, res: Response) => {
  try {
    const instructorId = req.user.id;
    const courseData = createCourseSchema.parse(req.body);

    const course = await prisma.course.create({
      data: {
        ...courseData,
        instructorId,
        status: 'DRAFT',
        sections: {
          create: [
            {
              title: 'Introduction',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'Welcome to the Course',
                    order: 1,
                    type: 'VIDEO',
                    duration: 0,
                  },
                ],
              },
            },
          ],
        },
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });

    res.json({ id: course.id });
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

router.get('/api/instructor/courses', authenticateUser, async (req: Request, res: Response) => {
  try {
    const instructorId = req.user.id;

    const courses = await prisma.course.findMany({
      where: {
        instructorId,
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
        enrollments: true,
        reviews: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/api/instructor/courses/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const instructorId = req.user.id;
    const courseId = req.params.id;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        enrollments: {
          include: {
            user: true,
            progress: true,
          },
        },
        reviews: {
          include: {
            user: true,
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

router.put('/api/instructor/courses/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const instructorId = req.user.id;
    const courseId = req.params.id;
    const courseData = createCourseSchema.parse(req.body);

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
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
        sections: {
          include: {
            lessons: true,
          },
        },
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

router.delete('/api/instructor/courses/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const instructorId = req.user.id;
    const courseId = req.params.id;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId,
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