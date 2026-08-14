import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All order routes require authentication
router.use(authenticateJWT);

// Admin routes
router.get('/all', requireRole('ADMIN'), asyncHandler(orderController.getAllOrders));
router.patch('/:id/status', requireRole('ADMIN'), asyncHandler(orderController.updateOrderStatus));

// Customer routes
router.post('/', asyncHandler(orderController.checkout));
router.get('/', asyncHandler(orderController.getMyOrders));
router.get('/:id', asyncHandler(orderController.getMyOrderById));

export default router;
