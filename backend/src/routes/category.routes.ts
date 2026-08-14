import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(categoryController.getCategories));
router.get('/:id', asyncHandler(categoryController.getCategory));

// Protected Admin routes
router.post('/', authenticateJWT, requireRole('ADMIN'), asyncHandler(categoryController.createCategory));
router.patch('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(categoryController.updateCategory));
router.delete('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(categoryController.deleteCategory));

export default router;
