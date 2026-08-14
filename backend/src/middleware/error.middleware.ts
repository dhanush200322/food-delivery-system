import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return sendError(res, 'A record with this value already exists', [], 409);
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(err.statusCode || 500).json({
    success: false,
    message: isProduction && (err.statusCode === 500 || !err.statusCode) ? 'Internal Server Error' : err.message || 'Internal Server Error',
    errors: []
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return sendError(res, `Route not found: ${req.originalUrl}`, [], 404);
};
