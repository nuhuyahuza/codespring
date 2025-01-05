import { PrismaClient } from '@prisma/client';

declare global {
  let prisma: PrismaClient | undefined;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 