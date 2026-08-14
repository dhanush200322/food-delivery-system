import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as restaurantService from '../services/restaurant.service';

export const getRestaurants = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

  const data = await restaurantService.getAllRestaurants(page, limit);
  return sendSuccess(res, 'Restaurants fetched successfully', data);
};

export const getRestaurant = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const restaurant = await restaurantService.getRestaurantById(id);
  return sendSuccess(res, 'Restaurant fetched successfully', { restaurant });
};

export const createRestaurant = async (req: Request, res: Response) => {
  const { name, description, imageUrl, cuisineType, rating, deliveryTime, isAvailable } = req.body;

  if (!name || !cuisineType) {
    return sendError(res, 'Name and cuisineType are required', [], 400);
  }

  let parsedRating: number | undefined;
  if (rating !== undefined) {
    parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return sendError(res, 'Rating must be a number between 0 and 5', [], 400);
    }
  }

  if (isAvailable !== undefined && typeof isAvailable !== 'boolean') {
    return sendError(res, 'isAvailable must be a boolean', [], 400);
  }

  const restaurant = await restaurantService.createRestaurant({
    name,
    description,
    imageUrl,
    cuisineType,
    rating: parsedRating,
    deliveryTime,
    isAvailable: isAvailable ?? true
  });

  return sendSuccess(res, 'Restaurant created successfully', { restaurant }, 201);
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description, imageUrl, cuisineType, rating, deliveryTime, isAvailable } = req.body;

  let parsedRating: number | undefined;
  if (rating !== undefined) {
    parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return sendError(res, 'Rating must be a number between 0 and 5', [], 400);
    }
  }

  if (isAvailable !== undefined && typeof isAvailable !== 'boolean') {
    return sendError(res, 'isAvailable must be a boolean', [], 400);
  }

  const dataToUpdate = {
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(imageUrl !== undefined && { imageUrl }),
    ...(cuisineType && { cuisineType }),
    ...(parsedRating !== undefined && { rating: parsedRating }),
    ...(deliveryTime !== undefined && { deliveryTime }),
    ...(isAvailable !== undefined && { isAvailable })
  };

  if (Object.keys(dataToUpdate).length === 0) {
    return sendError(res, 'No valid fields provided for update', [], 400);
  }

  const restaurant = await restaurantService.updateRestaurant(id, dataToUpdate);
  return sendSuccess(res, 'Restaurant updated successfully', { restaurant });
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await restaurantService.deleteRestaurant(id);
  // Using 200 with a clean message as requested
  return sendSuccess(res, 'Restaurant deleted successfully', {}, 200);
};
