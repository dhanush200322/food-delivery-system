import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL is not defined in the environment!");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString && !connectionString.includes('.internal') 
    ? { rejectUnauthorized: false } 
    : undefined
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
