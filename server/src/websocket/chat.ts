import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface User {
  id: string;
  email: string;
  role: string;
}

export function setupChatServer(io: Server) {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as User;

      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.user.email);

    // Join a group chat
    socket.on('join-group', async (groupId: string) => {
      try {
        // Verify group membership
        const member = await prisma.groupMember.findFirst({
          where: {
            groupId,
            userId: socket.data.user.id,
          },
        });

        if (!member) {
          socket.emit('error', 'Not a member of this group');
          return;
        }

        socket.join(groupId);
        console.log(`User ${socket.data.user.email} joined group ${groupId}`);

        // Fetch recent messages
        const messages = await prisma.message.findMany({
          where: { groupId },
          take: 50,
          orderBy: { createdAt: 'desc' },
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

        socket.emit('recent-messages', messages.reverse());
      } catch (error) {
        console.error('Error joining group:', error);
        socket.emit('error', 'Failed to join group');
      }
    });

    // Leave a group chat
    socket.on('leave-group', (groupId: string) => {
      socket.leave(groupId);
      console.log(`User ${socket.data.user.email} left group ${groupId}`);
    });

    // Send a message
    socket.on('send-message', async (data: { groupId: string; content: string }) => {
      try {
        const { groupId, content } = data;

        // Create message
        const message = await prisma.message.create({
          data: {
            content,
            groupId,
            userId: socket.data.user.id,
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

        // Broadcast to group
        io.to(groupId).emit('new-message', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.email);
    });
  });
} 