import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as foodService from '../services/food.service';

import * as categoryService from '../services/category.service';

export const getFoods = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));

  let { search, categoryId, minPrice, maxPrice, minRating, isAvailable, sortBy, sortOrder } = req.query;

  const parsedSearch = typeof search === 'string' && search.trim() !== '' ? search.trim() : undefined;
  const parsedCategoryId = typeof categoryId === 'string' && categoryId.trim() !== '' ? categoryId.trim() : undefined;

  let parsedMinPrice: string | undefined;
  let parsedMaxPrice: string | undefined;

  const moneyRegex = /^\d+(\.\d{1,2})?$/;

  if (minPrice !== undefined) {
    const minStr = minPrice as string;
    if (!moneyRegex.test(minStr)) return sendError(res, 'minPrice must be a valid non-negative number', [], 400);
    parsedMinPrice = minStr;
  }

  if (maxPrice !== undefined) {
    const maxStr = maxPrice as string;
    if (!moneyRegex.test(maxStr)) return sendError(res, 'maxPrice must be a valid non-negative number', [], 400);
    parsedMaxPrice = maxStr;
  }

  if (parsedMinPrice !== undefined && parsedMaxPrice !== undefined) {
    // string comparison isn't safe for numeric value (e.g., "10" vs "9"), but we just rely on Prisma to filter it properly or we can parse strictly to compare.
    if (parseFloat(parsedMinPrice) > parseFloat(parsedMaxPrice)) {
      return sendError(res, 'minPrice cannot be greater than maxPrice', [], 400);
    }
  }

  let parsedMinRating: number | undefined;
  if (minRating !== undefined) {
    parsedMinRating = parseFloat(minRating as string);
    if (isNaN(parsedMinRating) || parsedMinRating < 0 || parsedMinRating > 5) return sendError(res, 'minRating must be a number between 0 and 5', [], 400);
  }

  let parsedIsAvailable: boolean | undefined;
  if (isAvailable !== undefined) {
    if (isAvailable === 'true') parsedIsAvailable = true;
    else if (isAvailable === 'false') parsedIsAvailable = false;
    else return sendError(res, 'isAvailable must be true or false', [], 400);
  }

  const validSortFields = ['rating', 'price', 'popularity'];
  let parsedSortBy: 'rating' | 'price' | 'popularity' | undefined;
  if (sortBy !== undefined) {
    if (typeof sortBy !== 'string' || !validSortFields.includes(sortBy)) {
      return sendError(res, 'sortBy must be one of: rating, price, popularity', [], 400);
    }
    parsedSortBy = sortBy as 'rating' | 'price' | 'popularity';
  }

  const validSortOrders = ['asc', 'desc'];
  let parsedSortOrder: 'asc' | 'desc' | undefined;
  if (sortOrder !== undefined) {
    if (typeof sortOrder !== 'string' || !validSortOrders.includes(sortOrder)) {
      return sendError(res, 'sortOrder must be one of: asc, desc', [], 400);
    }
    parsedSortOrder = sortOrder as 'asc' | 'desc';
  }

  if (parsedCategoryId) {
    try {
      await categoryService.getCategoryById(parsedCategoryId);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return sendError(res, 'Category not found', [], 404);
      }
      throw error;
    }
  }

  const data = await foodService.getAllFoods({
    page,
    limit,
    search: parsedSearch,
    categoryId: parsedCategoryId,
    minPrice: parsedMinPrice,
    maxPrice: parsedMaxPrice,
    minRating: parsedMinRating,
    isAvailable: parsedIsAvailable,
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder
  });

  return sendSuccess(res, 'Foods fetched successfully', data);
};

export const getFood = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const food = await foodService.getFoodById(id);
  return sendSuccess(res, 'Food item fetched successfully', { food });
};

export const createFood = async (req: Request, res: Response) => {
  const { restaurantId, categoryId, name, description, imageUrl, price, rating, popularity, isAvailable } = req.body;

  if (!restaurantId || typeof restaurantId !== 'string') return sendError(res, 'restaurantId is required and must be a string', [], 400);
  if (!categoryId || typeof categoryId !== 'string') return sendError(res, 'categoryId is required and must be a string', [], 400);
  if (!name || typeof name !== 'string' || name.trim() === '') return sendError(res, 'Name is required and cannot be empty', [], 400);

  const trimmedName = name.trim();
  if (trimmedName.length > 150) return sendError(res, 'Name exceeds maximum length', [], 400);

  let trimmedDescription = description;
  if (description !== undefined) {
    if (typeof description !== 'string') return sendError(res, 'Description must be a string', [], 400);
    trimmedDescription = description.trim();
    if (trimmedDescription.length > 1000) return sendError(res, 'Description exceeds maximum length', [], 400);
  }

  if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    return sendError(res, 'Price is required and must be a positive number', [], 400);
  }

  let parsedRating: number | undefined;
  if (rating !== undefined) {
    parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return sendError(res, 'Rating must be between 0 and 5', [], 400);
    }
  }

  let parsedPopularity: number | undefined;
  if (popularity !== undefined) {
    parsedPopularity = parseInt(popularity);
    if (isNaN(parsedPopularity) || parsedPopularity < 0) {
      return sendError(res, 'Popularity must be a non-negative integer', [], 400);
    }
  }

  if (isAvailable !== undefined && typeof isAvailable !== 'boolean') {
    return sendError(res, 'isAvailable must be a boolean', [], 400);
  }

  if (imageUrl !== undefined && typeof imageUrl !== 'string') {
    return sendError(res, 'imageUrl must be a string', [], 400);
  }

  const food = await foodService.createFood({
    restaurantId,
    categoryId,
    name: trimmedName,
    description: trimmedDescription,
    imageUrl,
    price, // String/Number is passed to service which handles Prisma.Decimal
    rating: parsedRating,
    popularity: parsedPopularity,
    isAvailable: isAvailable ?? true
  });

  return sendSuccess(res, 'Food created successfully', { food }, 201);
};

export const updateFood = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { restaurantId, categoryId, name, description, imageUrl, price, rating, popularity, isAvailable } = req.body;

  const dataToUpdate: any = {};

  if (restaurantId !== undefined) {
    if (typeof restaurantId !== 'string') return sendError(res, 'restaurantId must be a string', [], 400);
    dataToUpdate.restaurantId = restaurantId;
  }
  
  if (categoryId !== undefined) {
    if (typeof categoryId !== 'string') return sendError(res, 'categoryId must be a string', [], 400);
    dataToUpdate.categoryId = categoryId;
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') return sendError(res, 'Name cannot be empty', [], 400);
    const trimmed = name.trim();
    if (trimmed.length > 150) return sendError(res, 'Name exceeds maximum length', [], 400);
    dataToUpdate.name = trimmed;
  }

  if (description !== undefined) {
    if (typeof description !== 'string') return sendError(res, 'Description must be a string', [], 400);
    const trimmed = description.trim();
    if (trimmed.length > 1000) return sendError(res, 'Description exceeds maximum length', [], 400);
    dataToUpdate.description = trimmed;
  }

  if (price !== undefined) {
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) return sendError(res, 'Price must be a positive number', [], 400);
    dataToUpdate.price = price;
  }

  if (rating !== undefined) {
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) return sendError(res, 'Rating must be between 0 and 5', [], 400);
    dataToUpdate.rating = parsedRating;
  }

  if (popularity !== undefined) {
    const parsedPopularity = parseInt(popularity);
    if (isNaN(parsedPopularity) || parsedPopularity < 0) return sendError(res, 'Popularity must be a non-negative integer', [], 400);
    dataToUpdate.popularity = parsedPopularity;
  }

  if (isAvailable !== undefined) {
    if (typeof isAvailable !== 'boolean') return sendError(res, 'isAvailable must be a boolean', [], 400);
    dataToUpdate.isAvailable = isAvailable;
  }

  if (imageUrl !== undefined) {
    if (typeof imageUrl !== 'string') return sendError(res, 'imageUrl must be a string', [], 400);
    dataToUpdate.imageUrl = imageUrl;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return sendError(res, 'No valid fields provided for update', [], 400);
  }

  const food = await foodService.updateFood(id, dataToUpdate);
  return sendSuccess(res, 'Food updated successfully', { food });
};

export const deleteFood = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await foodService.deleteFood(id);
  return sendSuccess(res, 'Food item deleted successfully', {}, 200);
};
