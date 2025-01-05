import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/lib/auth';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      name?: string;
      image?: string;
    };
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const user = await verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication failed:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
