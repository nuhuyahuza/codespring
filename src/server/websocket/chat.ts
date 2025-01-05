import { Server, Socket } from 'socket.io';
import { prisma } from '@/server/db';
import { verifyToken } from '@/server/utils/auth';

interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
  groupId: string;
}

export function setupChatServer(io: Server) {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = await verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const { courseId, groupId, userId } = socket.handshake.query;

    // Join the group's room
    socket.join(`group:${groupId}`);

    // Handle getting message history
    socket.on('get_messages', async ({ groupId }, callback) => {
      try {
        const messages = await prisma.chatMessage.findMany({
          where: {
            groupId: groupId as string,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
          take: 100, // Limit to last 100 messages
        });

        const formattedMessages = messages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          userId: msg.userId,
          userName: `${msg.user.firstName} ${msg.user.lastName}`,
          userAvatar: msg.user.avatar,
          timestamp: msg.createdAt.toISOString(),
          groupId: msg.groupId,
        }));

        callback(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        callback([]);
      }
    });

    // Handle new messages
    socket.on('send_message', async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      try {
        // Save message to database
        const savedMessage = await prisma.chatMessage.create({
          data: {
            content: message.content,
            userId: message.userId,
            groupId: message.groupId,
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        });

        const formattedMessage = {
          id: savedMessage.id,
          content: savedMessage.content,
          userId: savedMessage.userId,
          userName: `${savedMessage.user.firstName} ${savedMessage.user.lastName}`,
          userAvatar: savedMessage.user.avatar,
          timestamp: savedMessage.createdAt.toISOString(),
          groupId: savedMessage.groupId,
        };

        // Broadcast message to all users in the group
        io.to(`group:${message.groupId}`).emit('new_message', formattedMessage);

        // Send notifications to group members who are not currently in the chat
        const groupMembers = await prisma.groupMember.findMany({
          where: {
            groupId: message.groupId,
            userId: {
              not: message.userId,
            },
          },
          include: {
            user: true,
          },
        });

        // Create notifications for offline members
        await prisma.notification.createMany({
          data: groupMembers.map((member) => ({
            userId: member.userId,
            type: 'CHAT_MESSAGE',
            title: 'New message in group chat',
            content: `${message.userName}: ${message.content.substring(0, 50)}${
              message.content.length > 50 ? '...' : ''
            }`,
            metadata: {
              groupId: message.groupId,
              messageId: savedMessage.id,
            },
          })),
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle user typing events
    socket.on('typing_start', () => {
      socket.to(`group:${groupId}`).emit('user_typing', {
        userId,
        userName: socket.data.user.firstName,
      });
    });

    socket.on('typing_end', () => {
      socket.to(`group:${groupId}`).emit('user_typing_end', {
        userId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      socket.leave(`group:${groupId}`);
    });
  });
} 