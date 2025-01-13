import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

// Get live classes for a student
router.get('/student/live-classes', authenticateUser, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user!.id;

    const now = new Date();
    const classes = await prisma.liveClass.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              userId,
            },
          },
        },
        ...(status === 'live' ? {
          startTime: { lte: now },
          endTime: { gt: now },
        } : status === 'upcoming' ? {
          startTime: { gt: now },
        } : status === 'completed' ? {
          endTime: { lt: now },
        } : {}),
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        instructor: {
          select: {
            name: true,
          },
        },
        attendees: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      title: cls.title,
      description: cls.description,
      startTime: cls.startTime,
      duration: cls.duration,
      instructorName: cls.instructor.name,
      courseTitle: cls.course.title,
      attendees: cls.attendees.length,
      status: cls.startTime > now ? 'upcoming' :
              cls.endTime > now ? 'live' : 'completed',
      joinUrl: cls.joinUrl,
      recordingUrl: cls.recordingUrl,
    }));

    res.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching live classes:', error);
    res.status(500).json({ error: 'Failed to fetch live classes' });
  }
});

// Join a live class
router.post('/student/live-classes/:classId/join', authenticateUser, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user!.id;

    const liveClass = await prisma.liveClass.findFirst({
      where: {
        id: classId,
        course: {
          enrollments: {
            some: {
              userId,
            },
          },
        },
      },
    });

    if (!liveClass) {
      return res.status(404).json({ error: 'Live class not found' });
    }

    // Record attendance
    await prisma.liveClassAttendee.create({
      data: {
        userId,
        liveClassId: classId,
      },
    });

    res.json({ joinUrl: liveClass.joinUrl });
  } catch (error) {
    console.error('Error joining live class:', error);
    res.status(500).json({ error: 'Failed to join live class' });
  }
});

// Get chat messages
router.get('/student/live-classes/:classId/chat', authenticateUser, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user!.id;

    const messages = await prisma.liveClassMessage.findMany({
      where: {
        liveClassId: classId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

// Send chat message
router.post('/student/live-classes/:classId/chat', authenticateUser, async (req, res) => {
  try {
    const { classId } = req.params;
    const { content, type } = req.body;
    const userId = req.user!.id;

    const message = await prisma.liveClassMessage.create({
      data: {
        content,
        type,
        senderId: userId,
        liveClassId: classId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.json(message);
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Upload file to chat
router.post(
  '/student/live-classes/:classId/chat/file',
  authenticateUser,
  upload.single('file'),
  async (req, res) => {
    try {
      const { classId } = req.params;
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const message = await prisma.liveClassMessage.create({
        data: {
          type: 'file',
          content: file.originalname,
          fileUrl: file.path,
          fileName: file.originalname,
          senderId: userId,
          liveClassId: classId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      res.json(message);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

export default router; 