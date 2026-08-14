import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as orderService from '../services/order.service';

const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export const checkout = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { customerName, customerPhone, deliveryAddress } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
    return sendError(res, 'customerName is required and cannot be empty', [], 400);
  }

  if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim() === '') {
    return sendError(res, 'customerPhone is required and cannot be empty', [], 400);
  }

  if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim() === '') {
    return sendError(res, 'deliveryAddress is required and cannot be empty', [], 400);
  }

  const order = await orderService.checkout(userId, {
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    deliveryAddress: deliveryAddress.trim()
  });

  return sendSuccess(res, 'Order placed successfully', { order }, 201);
};

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

  const data = await orderService.getMyOrders(userId, page, limit);
  return sendSuccess(res, 'Orders fetched successfully', data);
};

export const getMyOrderById = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const orderId = req.params.id as string;

  const order = await orderService.getMyOrderById(userId, orderId);
  return sendSuccess(res, 'Order fetched successfully', { order });
};

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  
  let status = req.query.status as string | undefined;
  
  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, [], 400);
    }
  }

  const data = await orderService.getAllOrders(page, limit, status);
  return sendSuccess(res, 'All orders fetched successfully', data);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return sendError(res, 'status is required and must be a string', [], 400);
  }

  if (!validStatuses.includes(status)) {
    return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, [], 400);
  }

  const order = await orderService.updateOrderStatus(orderId, status);
  return sendSuccess(res, 'Order status updated successfully', { order });
};
