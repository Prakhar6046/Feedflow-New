import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare namespace NodeJS {
  interface Global {
    prisma?: PrismaClient;
  }
}
declare let global: NodeJS.Global & typeof globalThis;

const prisma = global.prisma || new PrismaClient();

if (process.env.VERCEL_ENV === 'development') global.prisma = prisma;

export default prisma;
