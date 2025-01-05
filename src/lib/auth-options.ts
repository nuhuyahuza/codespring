import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  image?: string;
}

export async function verifyCredentials(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

export async function verifySession(token: string): Promise<User | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    return session?.user || null;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
} 