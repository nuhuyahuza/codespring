import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { upload } from '../middleware/upload';
import Filter from 'bad-words';

const router = Router();
const filter = new Filter();

// Schema for group validation
const GroupSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(['study', 'project', 'discussion', 'other']),
});

// Get all community groups
router.get('/student/community-groups', authenticateUser, async (req, res) => {
  try {
    const userId = req.user!.id;

    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: { members: true },
        },
        members: {
          where: { userId },
          take: 1,
        },
        messages: {
          take: 3,
          orderBy: { createdAt: 'desc' },
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

    const formattedGroups = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      category: group.category,
      memberCount: group._count.members,
      isJoined: group.members.length > 0,
      recentActivity: group.messages.map(message => ({
        type: 'message',
        title: `${message.user.name}: ${message.content.substring(0, 50)}...`,
        timestamp: message.createdAt,
      })),
    }));

    res.json(formattedGroups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Create a new group
router.post('/student/community-groups', authenticateUser, async (req, res) => {
  try {
    const data = GroupSchema.parse(req.body);
    const userId = req.user!.id;

    const group = await prisma.group.create({
      data: {
        ...data,
        members: {
          create: {
            userId,
            role: 'admin',
          },
        },
      },
    });

    res.json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Join a group
router.post('/student/community-groups/:groupId/join', authenticateUser, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    // Join group
    await prisma.groupMember.create({
      data: {
        userId,
        groupId,
        role: 'member',
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// Get group discussions
router.get('/student/community-groups/:groupId/discussions', authenticateUser, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;

    // Check if user is a member
    const member = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const messages = await prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

// Post a message
router.post('/student/community-groups/:groupId/messages', authenticateUser, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const userId = req.user!.id;

    // Check if user is banned
    const ban = await prisma.groupBan.findFirst({
      where: {
        groupId,
        userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    if (ban) {
      return res.status(403).json({ 
        error: 'You are banned from this group',
        expiresAt: ban.expiresAt,
      });
    }

    // Filter inappropriate content
    const filteredContent = filter.clean(content);
    const hasInappropriateContent = content !== filteredContent;

    // If content is inappropriate, create a warning
    if (hasInappropriateContent) {
      await prisma.userWarning.create({
        data: {
          userId,
          groupId,
          reason: 'Inappropriate content detected',
          content: content, // Store original content for review
        },
      });
    }

    // Create message with filtered content
    const message = await prisma.message.create({
      data: {
        content: filteredContent,
        userId,
        groupId,
        flagged: hasInappropriateContent,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(message);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

// Moderate a message
router.put(
  '/student/community-groups/:groupId/messages/:messageId/moderate',
  authenticateUser,
  async (req, res) => {
    try {
      const { groupId, messageId } = req.params;
      const { action } = req.body;
      const userId = req.user!.id;

      // Check if user is a moderator
      const member = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      if (!member || !['admin', 'moderator'].includes(member.role)) {
        return res.status(403).json({ error: 'Not authorized to moderate' });
      }

      switch (action) {
        case 'delete':
          await prisma.message.delete({
            where: { id: messageId },
          });
          break;
        case 'warn':
          // Add warning to message author
          const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { user: true },
          });
          await prisma.userWarning.create({
            data: {
              userId: message!.userId,
              groupId,
              reason: req.body.reason || 'Inappropriate content',
              issuedById: userId,
            },
          });
          break;
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error moderating message:', error);
      res.status(500).json({ error: 'Failed to moderate message' });
    }
  }
);

// Update member role
router.put(
  '/student/community-groups/:groupId/members/:memberId/role',
  authenticateUser,
  async (req, res) => {
    try {
      const { groupId, memberId } = req.params;
      const { role } = req.body;
      const userId = req.user!.id;

      // Check if user is an admin
      const requester = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      if (!requester || requester.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to change roles' });
      }

      // Update member role
      await prisma.groupMember.update({
        where: {
          id: memberId,
        },
        data: {
          role,
        },
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error updating member role:', error);
      res.status(500).json({ error: 'Failed to update member role' });
    }
  }
);

// Upload file to discussion
router.post(
  '/student/community-groups/:groupId/messages/file',
  authenticateUser,
  upload.single('file'),
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Check if user is a member
      const member = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      if (!member) {
        return res.status(403).json({ error: 'Not a member of this group' });
      }

      // Create message with file
      const message = await prisma.message.create({
        data: {
          content: req.body.message || 'Shared a file',
          userId,
          groupId,
          fileUrl: file.path,
          fileName: file.originalname,
          fileType: file.mimetype,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
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

// Ban a user from a group
router.post(
  '/student/community-groups/:groupId/bans',
  authenticateUser,
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const { userId, reason, duration } = req.body;
      const moderatorId = req.user!.id;

      // Check if moderator has permission
      const moderator = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: moderatorId,
            groupId,
          },
        },
      });

      if (!moderator || !['admin', 'moderator'].includes(moderator.role)) {
        return res.status(403).json({ error: 'Not authorized to ban users' });
      }

      // Create ban record
      const ban = await prisma.groupBan.create({
        data: {
          groupId,
          userId,
          reason,
          expiresAt: duration ? new Date(Date.now() + duration) : null,
          issuedById: moderatorId,
        },
      });

      // Remove user from group
      await prisma.groupMember.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      res.json(ban);
    } catch (error) {
      console.error('Error banning user:', error);
      res.status(500).json({ error: 'Failed to ban user' });
    }
  }
);

export default router; 