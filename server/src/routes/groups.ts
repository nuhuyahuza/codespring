import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all groups for a course
router.get('/course/:courseId', authenticateUser, async (req, res) => {
  try {
    const { courseId } = req.params;
    const groups = await prisma.group.findMany({
      where: { courseId },
      include: {
        members: {
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
      },
    });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Create a group
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, description, courseId } = req.body;
    const group = await prisma.group.create({
      data: {
        name,
        description,
        courseId,
        members: {
          create: {
            userId: req.user!.id,
            role: 'owner',
          },
        },
      },
      include: {
        members: {
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
      },
    });
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Join a group
router.post('/:id/join', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const member = await prisma.groupMember.create({
      data: {
        groupId: id,
        userId: req.user!.id,
        role: 'member',
      },
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
    res.status(201).json(member);
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Leave a group
router.delete('/:id/leave', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.groupMember.deleteMany({
      where: {
        groupId: id,
        userId: req.user!.id,
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

export default router; 