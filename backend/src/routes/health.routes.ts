import { Router } from 'express';
import { checkHealth, checkDbHealth } from '../controllers/health.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', checkHealth);
router.get('/db', asyncHandler(checkDbHealth));
router.get('/error', (req, res) => {
  throw new Error('This is a sensitive internal Prisma stack trace error message that should not leak!');
});

export default router;
