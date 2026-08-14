import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not defined in the environment!");
}

const adapter = new PrismaPg({ 
  connectionString,
  // Pass SSL if it's not an internal Render URL
  ssl: connectionString && !connectionString.includes('.internal') ? { rejectUnauthorized: false } : undefined
});

const prisma = new PrismaClient({ adapter });

export default prisma;
