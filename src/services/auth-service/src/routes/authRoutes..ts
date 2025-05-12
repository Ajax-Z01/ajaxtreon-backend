import { Router } from 'express';
import authController from '../controllers';
import { authenticateUser } from '@shared/middlewares/authMiddleware';

const router: Router = Router();

// @route POST /api/auth/register
router.post('/register', authController.registerUser);

// @route GET /api/auth/me
router.get('/profile', authenticateUser, authController.getUserProfile);

export default router;
