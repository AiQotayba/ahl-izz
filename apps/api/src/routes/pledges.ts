import { Router } from 'express';
import {
  submitPledge,
  getPledges,
  getPledgeById,
  updatePledge,
  erasePledgePII,
  getPublicPledges,
  getPledgeStats,
  validatePledgeSubmission,
  validatePledgeUpdate
} from '../controllers/pledgeController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';
import { pledgeRateLimit, adminRateLimit, generalRateLimit } from '../middlewares/rateLimiter';

const router = Router();

// Public routes
router.post('/', pledgeRateLimit, validatePledgeSubmission, submitPledge);
router.get('/public', generalRateLimit, getPublicPledges);
router.get('/stats', generalRateLimit, getPledgeStats);

// Admin routes
router.get('/', authenticateToken, requireAdmin, adminRateLimit, getPledges);
router.get('/:id', authenticateToken, requireAdmin, adminRateLimit, getPledgeById);
router.put('/:id', authenticateToken, requireAdmin, adminRateLimit, validatePledgeUpdate, updatePledge);
router.delete('/:id/erase', authenticateToken, requireAdmin, adminRateLimit, erasePledgePII);

export default router;

