import { PrismaClient } from '@prisma/client';
import path from 'path';

// If no DATABASE_URL is defined (e.g. on Vercel), point to the bundled read-only SQLite database!
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../../../prisma/dev.db')}`;
  console.log(`[Prisma Database]: Set serverless fallback URL to: ${process.env.DATABASE_URL}`);
}

const prisma = new PrismaClient();

export default prisma;
export { prisma };
