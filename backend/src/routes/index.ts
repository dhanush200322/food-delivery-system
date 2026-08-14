import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import restaurantRoutes from './restaurant.routes';
import categoryRoutes from './category.routes';
import foodRoutes from './food.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import favoriteRoutes from './favorite.routes';
import promotionRoutes from './promotion.routes';

const router = Router();

// Define API versions
// Example: router.use('/v1/auth', authRoutes);

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/categories', categoryRoutes);
router.use('/foods', foodRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/promotions', promotionRoutes);

// Health check routes
router.use('/health', healthRoutes);

export default router;
