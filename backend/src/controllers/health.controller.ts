import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { sendError } from '../utils/response';
import { Pool } from 'pg';

export const checkHealth = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Food Delivery API is running"
  });
};

export const checkDbHealth = async (req: Request, res: Response) => {
  try {
    const cs = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString: cs,
      ssl: cs && !cs.includes('.internal') ? { rejectUnauthorized: false } : undefined
    });
    
    // First try raw pg to get a good error message
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
    } catch (pgError) {
      console.error("PG Native Connection Failed:", pgError);
      return res.status(500).json({
        success: false,
        message: "PG Native Connection failed",
        error: pgError instanceof Error ? pgError.message : String(pgError),
        url_prefix: cs ? cs.split(':')[0] : 'none'
      });
    }

    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Database connection successful"
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
