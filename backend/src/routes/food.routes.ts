import { Router } from 'express';
import * as foodController from '../controllers/food.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(foodController.getFoods));
router.get('/:id', asyncHandler(foodController.getFood));

// Protected Admin routes
router.post('/', authenticateJWT, requireRole('ADMIN'), asyncHandler(foodController.createFood));
router.patch('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(foodController.updateFood));
router.delete('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(foodController.deleteFood));

export default router;
