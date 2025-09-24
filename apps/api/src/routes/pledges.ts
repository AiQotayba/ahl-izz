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
  validatePledgeUpdate,
  excelPledge
} from '../controllers/pledgeController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/', validatePledgeSubmission, submitPledge);
router.get('/public', getPublicPledges);
router.get('/stats', getPledgeStats);

// Admin routes
router.get('/',
  authenticateToken, requireAdmin,
  getPledges);
router.get('/:id', authenticateToken, requireAdmin, getPledgeById);
router.put('/:id', authenticateToken, requireAdmin, validatePledgeUpdate, updatePledge);
router.get('/excel',
  authenticateToken, requireAdmin,
  excelPledge);
router.delete('/:id/erase', authenticateToken, requireAdmin, erasePledgePII);

export default router;

