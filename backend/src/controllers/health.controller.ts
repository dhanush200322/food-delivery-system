import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { sendError } from '../utils/response';

export const checkHealth = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Food Delivery API is running"
  });
};

export const checkDbHealth = async (req: Request, res: Response) => {
  try {
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
