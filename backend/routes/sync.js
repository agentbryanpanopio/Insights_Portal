import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { triggerManualSync, getSyncStatus } from '../services/syncScheduler.js';
import logger from '../config/logger.js';

const router = express.Router();

// Trigger manual sync
router.post('/trigger', authenticateToken, async (req, res, next) => {
  try {
    logger.info(`Manual sync triggered by user ${req.user.email}`);

    const result = await triggerManualSync();

    res.json({
      message: 'Sync completed',
      result,
    });
  } catch (error) {
    next(error);
  }
});

// Get sync status
router.get('/status', authenticateToken, async (req, res, next) => {
  try {
    const status = getSyncStatus();

    res.json({
      status,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
