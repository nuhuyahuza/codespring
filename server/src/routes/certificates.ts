import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get user's certificates
router.get('/', authenticateUser, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        userId: req.user!.id,
      },
      include: {
        course: {
          select: {
            title: true,
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Generate certificate for completed course
router.post('/:courseId', authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.id;

    // Check if course is completed
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Check if all lessons are completed
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lesson: {
          courseId,
        },
      },
    });

    const allLessonsCompleted = enrollment.course.lessons.every(lesson =>
      lessonProgress.some(progress => 
        progress.lessonId === lesson.id && progress.completed
      )
    );

    if (!allLessonsCompleted) {
      return res.status(400).json({ error: 'Course not completed' });
    }

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        courseId,
        userId,
      },
      include: {
        course: {
          select: {
            title: true,
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

export default router; 