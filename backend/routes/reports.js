import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';
import { listPBIXFiles, downloadFile } from '../services/googleDrive.js';
import { connectToPBIX, getMetadata, listTables, listMeasures } from '../services/mcpServer.js';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// List all PBIX reports
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    logger.info(`User ${req.user.email} requested report list`);

    const reports = await listPBIXFiles();

    res.json({
      reports,
      count: reports.reduce((sum, category) => sum + category.files.length, 0),
    });
  } catch (error) {
    next(error);
  }
});

// Get report details
router.get('/:fileId', authenticateToken, async (req, res, next) => {
  try {
    const { fileId } = req.params;

    logger.info(`User ${req.user.email} requested report details: ${fileId}`);

    // Download PBIX to temp directory
    const tempDir = path.join(__dirname, '../../temp');
    const tempPath = path.join(tempDir, `${fileId}.pbix`);

    await downloadFile(fileId, tempPath);

    // Connect to PBIX via MCP
    const connectionName = `${req.user.id}_${fileId}`;
    await connectToPBIX(tempPath, connectionName);

    // Get metadata
    const metadata = await getMetadata(connectionName);

    res.json({
      fileId,
      connectionName,
      metadata,
      path: tempPath,
    });
  } catch (error) {
    next(error);
  }
});

// Get report tables
router.get('/:connectionName/tables', authenticateToken, async (req, res, next) => {
  try {
    const { connectionName } = req.params;

    logger.info(`User ${req.user.email} requested tables for: ${connectionName}`);

    const tables = await listTables(connectionName);

    res.json({
      tables,
      count: tables.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get report measures
router.get('/:connectionName/measures', authenticateToken, async (req, res, next) => {
  try {
    const { connectionName } = req.params;
    const { tableName } = req.query;

    logger.info(`User ${req.user.email} requested measures for: ${connectionName}`);

    const measures = await listMeasures(connectionName, tableName);

    res.json({
      measures,
      count: measures.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get report metadata (full details)
router.get('/:connectionName/metadata', authenticateToken, async (req, res, next) => {
  try {
    const { connectionName } = req.params;

    logger.info(`User ${req.user.email} requested metadata for: ${connectionName}`);

    const metadata = await getMetadata(connectionName);

    res.json({
      metadata,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
