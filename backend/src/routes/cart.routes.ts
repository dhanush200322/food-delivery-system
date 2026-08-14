import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All cart routes require authentication
router.use(authenticateJWT);

router.get('/', asyncHandler(cartController.getCart));
router.post('/items', asyncHandler(cartController.addToCart));
router.patch('/items/:foodId', asyncHandler(cartController.updateQuantity));
router.delete('/items/:foodId', asyncHandler(cartController.removeCartItem));
router.delete('/', asyncHandler(cartController.clearCart));

export default router;
