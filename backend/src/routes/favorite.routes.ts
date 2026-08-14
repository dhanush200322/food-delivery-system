import { Router } from 'express';
import * as favoriteController from '../controllers/favorite.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// All favorites routes require authentication
router.use(authenticateJWT);

router.get('/', asyncHandler(favoriteController.getFavorites));
router.post('/:foodId', asyncHandler(favoriteController.addFavorite));
router.delete('/:foodId', asyncHandler(favoriteController.removeFavorite));

export default router;
