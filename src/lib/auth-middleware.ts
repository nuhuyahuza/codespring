import { Request, Response, NextFunction } from 'express';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name?: string;
      };
    }
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = session.user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
} 