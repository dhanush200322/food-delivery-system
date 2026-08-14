import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as favoriteService from '../services/favorite.service';

export const getFavorites = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const favorites = await favoriteService.getFavorites(userId);
  return sendSuccess(res, 'Favorites fetched successfully', { favorites });
};

export const addFavorite = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const foodId = req.params.foodId as string;

  if (!foodId || typeof foodId !== 'string') {
    return sendError(res, 'foodId is required', [], 400);
  }

  const favorite = await favoriteService.addFavorite(userId, foodId);
  return sendSuccess(res, 'Food added to favorites', { favorite }, 201);
};

export const removeFavorite = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const foodId = req.params.foodId as string;

  if (!foodId || typeof foodId !== 'string') {
    return sendError(res, 'foodId is required', [], 400);
  }

  await favoriteService.removeFavorite(userId, foodId);
  return sendSuccess(res, 'Favorite removed successfully', null);
};
