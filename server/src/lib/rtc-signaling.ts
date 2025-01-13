import { WebSocket } from 'ws';
import { verifyToken } from './jwt';

interface RTCClient extends WebSocket {
  userId?: string;
  roomId?: string;
}

export class RTCSignalingServer {
  private rooms: Map<string, Set<RTCClient>> = new Map();

  constructor() {
    this.setupWebSocket();
  }

  private setupWebSocket() {
    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', async (ws: RTCClient, req) => {
      try {
        // Authenticate user
        const url = new URL(req.url!, `ws://${req.headers.host}`);
        const token = url.searchParams.get('token');
        
        if (!token) {
          ws.close(1008, 'Token required');
          return;
        }

        const user = await verifyToken(token);
        if (!user) {
          ws.close(1008, 'Invalid token');
          return;
        }

        ws.userId = user.id;

        // Handle messages
        ws.on('message', (data: string) => {
          try {
            const message = JSON.parse(data);
            
            switch (message.type) {
              case 'join':
                this.handleJoinRoom(ws, message.roomId);
                break;
              case 'offer':
              case 'answer':
              case 'ice-candidate':
                this.broadcastToRoom(message.roomId, message, ws);
                break;
            }
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
          }
        });

        // Handle disconnect
        ws.on('close', () => {
          if (ws.roomId) {
            this.handleLeaveRoom(ws, ws.roomId);
          }
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1011, 'Internal server error');
      }
    });
  }

  private handleJoinRoom(client: RTCClient, roomId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    
    this.rooms.get(roomId)!.add(client);
    client.roomId = roomId;
  }

  private handleLeaveRoom(client: RTCClient, roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(client);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  private broadcastToRoom(roomId: string, message: any, sender: RTCClient) {
    const room = this.rooms.get(roomId);
    if (room) {
      const messageStr = JSON.stringify(message);
      room.forEach(client => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }
} 