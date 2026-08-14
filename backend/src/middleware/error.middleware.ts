import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.message || err);

  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Sanitize 500 error messages so Prisma stack traces or internals do not leak to the client
  if (statusCode === 500) {
    message = 'Internal Server Error';
  }

  return sendError(res, message, [], statusCode);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return sendError(res, `Route not found: ${req.originalUrl}`, [], 404);
};
