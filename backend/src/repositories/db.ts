import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'prisma/dev.db');
const tempDbPath = '/tmp/dev.db';

// If no DATABASE_URL is defined (e.g. on Vercel), point to the SQLite database
if (!process.env.DATABASE_URL) {
  // If we are in a serverless environment, copy the database to /tmp so SQLite can open/write to it!
  if (process.env.VERCEL === '1') {
    try {
      console.log(`[Prisma Database]: Serverless environment detected. Bundled DB path: ${dbPath}`);
      
      // Ensure the destination folder exists (usually /tmp exists, but just in case)
      const tempDbDir = path.dirname(tempDbPath);
      if (!fs.existsSync(tempDbDir)) {
        fs.mkdirSync(tempDbDir, { recursive: true });
      }

      // Copy the database file
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tempDbPath);
        console.log(`[Prisma Database]: Successfully copied database to ${tempDbPath}`);
      } else {
        console.error(`[Prisma Database]: Bundled database NOT found at ${dbPath}!`);
      }
    } catch (copyError) {
      console.error('[Prisma Database]: Failed to copy database to /tmp:', copyError);
    }
    process.env.DATABASE_URL = `file:${tempDbPath}`;
  } else {
    // Local development fallback
    process.env.DATABASE_URL = `file:${dbPath}`;
  }
  console.log(`[Prisma Database]: Set database URL to: ${process.env.DATABASE_URL}`);
}

const prisma = new PrismaClient();

export default prisma;
export { prisma };
