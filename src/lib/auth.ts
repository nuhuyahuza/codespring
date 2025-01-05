import { jwtDecode } from 'jwt-decode';
import { prisma } from './prisma';

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  image?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined,
      image: user.image || undefined
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function login(email: string, password: string): Promise<Response> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
} 