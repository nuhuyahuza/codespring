import { Router } from 'express';
import { prisma } from '@/server/db';
import { authenticateUser } from '@/server/middleware/auth';
import { Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  courseId: z.string(),
});

const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const addMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']).default('MEMBER'),
});

// Create a new group
router.post(
  '/api/groups',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { name, description, courseId } = createGroupSchema.parse(req.body);

      // Check if user is instructor or admin
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course || (course.instructorId !== req.user.id && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Create group and add creator as owner
      const group = await prisma.group.create({
        data: {
          name,
          description,
          courseId,
          members: {
            create: {
              userId: req.user.id,
              role: 'OWNER',
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json(group);
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ error: 'Failed to create group' });
    }
  }
);

// Get groups for a course
router.get(
  '/api/courses/:courseId/groups',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;

      // Check if user is enrolled in the course
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          courseId,
          userId: req.user.id,
          status: 'ACTIVE',
        },
      });

      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!enrollment && course?.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const groups = await prisma.group.findMany({
        where: { courseId },
        include: {
          _count: {
            select: {
              members: true,
              messages: true,
            },
          },
          members: {
            where: { userId: req.user.id },
            select: { role: true },
          },
        },
      });

      res.json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Failed to fetch groups' });
    }
  }
);

// Get a specific group
router.get(
  '/api/groups/:groupId',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;

      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              instructorId: true,
            },
          },
        },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      // Check if user is a member or instructor
      const isMember = group.members.some((m) => m.user.id === req.user.id);
      const isInstructor = group.course.instructorId === req.user.id;

      if (!isMember && !isInstructor && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      res.json(group);
    } catch (error) {
      console.error('Error fetching group:', error);
      res.status(500).json({ error: 'Failed to fetch group' });
    }
  }
);

// Update a group
router.patch(
  '/api/groups/:groupId',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      const updates = updateGroupSchema.parse(req.body);

      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: true,
          course: true,
        },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      // Check if user is owner, admin, or instructor
      const userRole = group.members.find((m) => m.userId === req.user.id)?.role;
      const isInstructor = group.course.instructorId === req.user.id;

      if (!userRole && !isInstructor && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (userRole !== 'OWNER' && !isInstructor && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: updates,
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json(updatedGroup);
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({ error: 'Failed to update group' });
    }
  }
);

// Add member to group
router.post(
  '/api/groups/:groupId/members',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      const { userId, role } = addMemberSchema.parse(req.body);

      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: true,
          course: {
            include: {
              enrollments: true,
            },
          },
        },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      // Check if user is enrolled in the course
      const isEnrolled = group.course.enrollments.some((e) => e.userId === userId);
      if (!isEnrolled) {
        return res.status(403).json({ error: 'User not enrolled in course' });
      }

      // Check if user is authorized to add members
      const userRole = group.members.find((m) => m.userId === req.user.id)?.role;
      const isInstructor = group.course.instructorId === req.user.id;

      if (!userRole && !isInstructor && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (userRole !== 'OWNER' && userRole !== 'ADMIN' && !isInstructor && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const member = await prisma.groupMember.create({
        data: {
          userId,
          groupId,
          role,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.json(member);
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ error: 'Failed to add member' });
    }
  }
);

// Remove member from group
router.delete(
  '/api/groups/:groupId/members/:userId',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { groupId, userId } = req.params;

      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: true,
          course: true,
        },
      });

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      // Check if user is authorized to remove members
      const userRole = group.members.find((m) => m.userId === req.user.id)?.role;
      const isInstructor = group.course.instructorId === req.user.id;
      const targetRole = group.members.find((m) => m.userId === userId)?.role;

      if (!userRole && !isInstructor && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      if (
        userRole !== 'OWNER' &&
        !isInstructor &&
        req.user.role !== 'ADMIN' &&
        req.user.id !== userId
      ) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Cannot remove owner unless you're an admin
      if (targetRole === 'OWNER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Cannot remove group owner' });
      }

      await prisma.groupMember.delete({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      res.json({ message: 'Member removed successfully' });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({ error: 'Failed to remove member' });
    }
  }
);

export default router; 