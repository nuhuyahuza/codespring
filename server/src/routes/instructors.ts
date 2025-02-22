import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/onboarding', authenticateUser, async (req, res) => {
  try {
    const data = req.body;

    const userId = req.user!.id;

    // Update user with instructor profile data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        hasCompletedOnboarding: true,
      },
    });

    res.json({
      message: 'Instructor profile completed successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding
      }
    });
  } catch (error) {
    console.error('Error in instructor onboarding:', error);
    res.status(500).json({ error: 'Failed to complete instructor profile' });
  }
});

export default router; 