import cron from 'node-cron';
import { syncAllFolders } from './googleDrive.js';
import logger from '../config/logger.js';

let syncTask = null;
let lastSyncTime = null;
let isSyncing = false;

export async function startSyncScheduler() {
  try {
    const intervalMinutes = parseInt(process.env.SYNC_INTERVAL_MINUTES) || 60;
    
    // Convert minutes to cron expression (e.g., */60 * * * * = every 60 minutes)
    const cronExpression = `*/${intervalMinutes} * * * *`;

    // Run initial sync
    logger.info('Running initial sync...');
    await performSync();

    // Schedule periodic syncs
    syncTask = cron.schedule(cronExpression, async () => {
      await performSync();
    });

    logger.info(`Sync scheduler started. Will sync every ${intervalMinutes} minutes`);
    return true;
  } catch (error) {
    logger.error('Failed to start sync scheduler:', error);
    throw error;
  }
}

export async function performSync() {
  if (isSyncing) {
    logger.warn('Sync already in progress, skipping...');
    return null;
  }

  try {
    isSyncing = true;
    logger.info('Starting Google Drive sync...');

    const startTime = Date.now();
    const results = await syncAllFolders();
    const duration = Date.now() - startTime;

    lastSyncTime = new Date();

    const totalFiles = 
      results.documentation.length +
      results.skills.length +
      results.scripts.length;

    logger.info(`Sync completed in ${duration}ms. Synced ${totalFiles} files.`);

    return {
      success: true,
      timestamp: lastSyncTime,
      duration,
      filesCounts: {
        documentation: results.documentation.length,
        skills: results.skills.length,
        scripts: results.scripts.length,
        total: totalFiles,
      },
    };
  } catch (error) {
    logger.error('Sync failed:', error);
    return {
      success: false,
      timestamp: new Date(),
      error: error.message,
    };
  } finally {
    isSyncing = false;
  }
}

export function stopSyncScheduler() {
  if (syncTask) {
    syncTask.stop();
    logger.info('Sync scheduler stopped');
    return true;
  }
  return false;
}

export function getSyncStatus() {
  return {
    active: syncTask !== null,
    syncing: isSyncing,
    lastSync: lastSyncTime,
    intervalMinutes: parseInt(process.env.SYNC_INTERVAL_MINUTES) || 60,
  };
}

export async function triggerManualSync() {
  logger.info('Manual sync triggered');
  return await performSync();
}
