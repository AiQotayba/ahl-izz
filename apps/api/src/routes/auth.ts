import { Router } from 'express';
import { login, refreshToken, logout, seedAdmin, validateLogin } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);

// Development only - seed admin user
// router.post('/seed-admin',  seedAdmin);

export default router;

