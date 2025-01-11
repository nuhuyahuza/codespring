import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { json, urlencoded } from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';

// Routes
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import submissionRoutes from './routes/submissions';
import groupRoutes from './routes/groups';
import studentRoutes from './routes/student';

// WebSocket
import { setupChatServer } from './websocket/chat';

// Load environment variables
config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(json());
app.use(urlencoded({ extended: true }));

// Serve static files from the uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', submissionRoutes);
app.use('/api', groupRoutes);
app.use('/api', studentRoutes);

// Setup WebSocket
setupChatServer(io);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
}); 