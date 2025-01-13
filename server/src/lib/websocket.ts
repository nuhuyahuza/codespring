import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { verifyToken } from './jwt';

interface WebSocketClient extends WebSocket {
  userId?: string;
  groupIds?: Set<string>;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private groups: Map<string, Set<WebSocketClient>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', async (ws: WebSocketClient, req) => {
      try {
        // Get token from query string
        const url = new URL(req.url!, `ws://${req.headers.host}`);
        const token = url.searchParams.get('token');
        
        if (!token) {
          ws.close(1008, 'Token required');
          return;
        }

        // Verify token and get user
        const user = await verifyToken(token);
        if (!user) {
          ws.close(1008, 'Invalid token');
          return;
        }

        ws.userId = user.id;
        ws.groupIds = new Set();

        // Handle messages
        ws.on('message', async (data: string) => {
          try {
            const message = JSON.parse(data);
            switch (message.type) {
              case 'join_group':
                this.joinGroup(ws, message.groupId);
                break;
              case 'leave_group':
                this.leaveGroup(ws, message.groupId);
                break;
              case 'new_message':
                this.broadcastToGroup(message.groupId, {
                  type: 'new_message',
                  data: message.data,
                });
                break;
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        });

        // Handle disconnect
        ws.on('close', () => {
          if (ws.groupIds) {
            ws.groupIds.forEach(groupId => this.leaveGroup(ws, groupId));
          }
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1011, 'Internal server error');
      }
    });
  }

  private joinGroup(ws: WebSocketClient, groupId: string) {
    if (!this.groups.has(groupId)) {
      this.groups.set(groupId, new Set());
    }
    this.groups.get(groupId)!.add(ws);
    ws.groupIds!.add(groupId);
  }

  private leaveGroup(ws: WebSocketClient, groupId: string) {
    const group = this.groups.get(groupId);
    if (group) {
      group.delete(ws);
      if (group.size === 0) {
        this.groups.delete(groupId);
      }
    }
    ws.groupIds!.delete(groupId);
  }

  public broadcastToGroup(groupId: string, data: any) {
    const group = this.groups.get(groupId);
    if (group) {
      const message = JSON.stringify(data);
      group.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }
} 