import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { config } from 'dotenv';
import authRoutes from './api/routes/auth';
import { prisma } from '@/lib/prisma';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use(authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connection established');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 