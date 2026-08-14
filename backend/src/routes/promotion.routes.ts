import { Router } from 'express';
import * as promotionController from '../controllers/promotion.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.get('/', asyncHandler(promotionController.getActivePromotions));
router.get('/:id', asyncHandler(promotionController.getPromotionById));

// Admin routes
router.post('/', authenticateJWT, requireRole('ADMIN'), asyncHandler(promotionController.createPromotion));
router.patch('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(promotionController.updatePromotion));
router.delete('/:id', authenticateJWT, requireRole('ADMIN'), asyncHandler(promotionController.deletePromotion));

export default router;
