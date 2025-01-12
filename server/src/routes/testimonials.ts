import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      take: 2,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        student: {
          select: {
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    const formattedTestimonials = testimonials.map((testimonial) => ({
      id: testimonial.id,
      content: testimonial.content,
      studentName: testimonial.student.name,
      studentRole: testimonial.student.role,
      studentAvatar: testimonial.student.avatar,
    }));

    res.json(formattedTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Add a new testimonial
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user?.id;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        content,
        studentId: userId,
      },
      include: {
        student: {
          select: {
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      id: testimonial.id,
      content: testimonial.content,
      studentName: testimonial.student.name,
      studentRole: testimonial.student.role,
      studentAvatar: testimonial.student.avatar,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

export default router; 