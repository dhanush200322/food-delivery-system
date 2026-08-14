import { Router } from 'express';
import * as restaurantController from '../controllers/restaurant.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(restaurantController.getRestaurants));
router.get('/:id', asyncHandler(restaurantController.getRestaurant));

// Protected Admin routes
router.post('/', authenticateJWT, requireRole('ADMIN'), asyncHandler(restaurantController.createRestaurant));
router.patch('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(restaurantController.updateRestaurant));
router.delete('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(restaurantController.deleteRestaurant));

export default router;
