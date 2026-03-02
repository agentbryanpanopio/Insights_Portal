import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { listFilesInFolder, FOLDERS } from '../services/googleDrive.js';
import logger from '../config/logger.js';

const router = express.Router();

// List files in documentation folder
router.get('/docs', authenticateToken, async (req, res, next) => {
  try {
    const files = await listFilesInFolder(FOLDERS.documentation);

    res.json({
      files,
      count: files.length,
    });
  } catch (error) {
    next(error);
  }
});

// List files in skills folder
router.get('/skills', authenticateToken, async (req, res, next) => {
  try {
    const files = await listFilesInFolder(FOLDERS.skills);

    res.json({
      files,
      count: files.length,
    });
  } catch (error) {
    next(error);
  }
});

// List files in scripts folder
router.get('/scripts', authenticateToken, async (req, res, next) => {
  try {
    const files = await listFilesInFolder(FOLDERS.scripts);

    res.json({
      files,
      count: files.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
