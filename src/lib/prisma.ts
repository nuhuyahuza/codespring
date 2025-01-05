import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as { prisma?: PrismaClient };

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}

export const prisma = globalForPrisma.prisma; 