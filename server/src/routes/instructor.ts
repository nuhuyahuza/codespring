import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/courses',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Get instructor's courses
router.get('/courses', authenticateUser, async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user!.id
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create a new course
router.post('/courses', authenticateUser, upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, price, category, level, duration } = req.body;
    const thumbnailUrl = req.file ? `/uploads/courses/${req.file.filename}` : null;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        level,
        duration: parseInt(duration),
        imageUrl: thumbnailUrl,
        instructorId: req.user!.id,
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/courses/:id', authenticateUser, upload.single('thumbnail'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, level, duration } = req.body;

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: req.user!.id
      }
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updateData: any = {
      title,
      description,
      price: parseFloat(price),
      category,
      level,
      duration: parseInt(duration),
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/courses/${req.file.filename}`;
    }

    const course = await prisma.course.update({
      where: { id },
      data: updateData
    });

    res.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/courses/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: req.user!.id
      }
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get instructor dashboard stats
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const user = req.user!;

    // Verify instructor role
    const instructor = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Get total number of courses
    const coursesCount = await prisma.course.count({
      where: { instructorId: user.id },
    });

    // Get total number of students
    const studentsCount = await prisma.enrollment.count({
      where: {
        course: {
          instructorId: user.id,
        },
      },
    });

    // Calculate total revenue
    const revenue = await prisma.enrollment.aggregate({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      _sum: {
        amountPaid: true,
      },
    });

    // Calculate average rating
    const ratings = await prisma.courseReview.aggregate({
      where: {
        course: {
          instructorId: user.id,
        },
      },
      _avg: {
        rating: true,
      },
    });

    // Get recent courses
    const recentCourses = await prisma.course.findMany({
      where: { instructorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    res.json({
      courses: coursesCount,
      students: studentsCount,
      revenue: revenue._sum.amountPaid || 0,
      rating: ratings._avg.rating || 0,
      recentCourses,
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router; 