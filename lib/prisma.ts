import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

export function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL. Set it in your environment before using Prisma.');
  }

  const pool =
    globalForPrisma.prismaPool ??
    new Pool({
      connectionString,
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
