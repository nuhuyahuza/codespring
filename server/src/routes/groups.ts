import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get enrolled groups
router.get('/enrolled', authenticateUser, async (req, res) => {
  try {
    const groups = await prisma.groupMember.findMany({
      where: {
        members: {
          some: {
            userId: req.user!.id,
          },
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            User: true,
            messages: true,
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

// Get group messages
router.get('/:groupId/messages', authenticateUser, async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        groupId,
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/:groupId/messages', authenticateUser, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    const message = await prisma.message.create({
      data: {
        content,
        userId,
        groupId,
      },
      include: {
        User: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create group
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.user!.id;

    const group = await prisma.group.create({
      data: {
        name,
        description,
        category,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
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

export default router; 