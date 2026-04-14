import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { getRequiredEnv } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

export function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = getRequiredEnv('DATABASE_URL', 'Prisma');

  const isProduction = process.env.NODE_ENV === 'production';

  const pool =
    globalForPrisma.prismaPool ??
    new Pool({
      connectionString,
      ...(isProduction ? { ssl: { rejectUnauthorized: false } } : {}),
    });

  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
    globalForPrisma.prismaPool = pool;
  }

  return prisma;
}
