import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const cart = await cartService.getCart(userId);
  return sendSuccess(res, 'Cart fetched successfully', { cart });
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { foodId, quantity } = req.body;

  if (!foodId || typeof foodId !== 'string') {
    return sendError(res, 'foodId is required and must be a string', [], 400);
  }

  if (quantity === undefined || !Number.isInteger(quantity) || quantity <= 0) {
    return sendError(res, 'quantity is required and must be a positive integer', [], 400);
  }

  const cart = await cartService.addToCart(userId, foodId, quantity);
  return sendSuccess(res, 'Item added to cart', { cart }, 201);
};

export const updateQuantity = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const foodId = req.params.foodId as string;
  const { quantity } = req.body;

  if (quantity === undefined || !Number.isInteger(quantity) || quantity <= 0) {
    return sendError(res, 'quantity is required and must be a positive integer', [], 400);
  }

  const cart = await cartService.updateQuantity(userId, foodId, quantity);
  return sendSuccess(res, 'Cart item updated', { cart });
};

export const removeCartItem = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const foodId = req.params.foodId as string;

  const cart = await cartService.removeCartItem(userId, foodId);
  return sendSuccess(res, 'Item removed from cart', { cart });
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await cartService.clearCart(userId);
  
  // Return an empty cart representation after clearing
  return sendSuccess(res, 'Cart cleared successfully', {
    cart: {
      id: null,
      items: [],
      itemCount: 0,
      subtotal: "0.00"
    }
  });
};
