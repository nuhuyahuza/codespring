import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all submissions for a lesson
router.get('/api/lessons/:lessonId/submissions', authenticateUser, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const submissions = await prisma.submission.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Create a new submission
router.post('/api/submissions', authenticateUser, async (req, res) => {
  try {
    const { courseId, lessonId, content } = req.body;
    const submission = await prisma.submission.create({
      data: {
        content,
        courseId,
        lessonId,
        userId: req.user!.id,
      },
    });
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Grade a submission
router.put('/api/submissions/:id/grade', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        score,
        feedback,
        status: 'GRADED',
        gradedAt: new Date(),
      },
    });
    res.json(submission);
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

export default router; 