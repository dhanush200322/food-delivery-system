import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 'Name, email, and password are required', [], 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendError(res, 'Invalid email format', [], 400);
  }

  if (password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters long', [], 400);
  }

  const data = await authService.registerUser({ name, email, password, phone });
  
  return sendSuccess(res, 'Registration successful', data, 201);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Email and password are required', [], 400);
  }

  const data = await authService.loginUser({ email, password });
  
  return sendSuccess(res, 'Login successful', data);
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    return sendError(res, 'User ID not found in token', [], 401);
  }

  const user = await authService.getUserById(userId);
  
  return sendSuccess(res, 'Authenticated user', { user });
};
