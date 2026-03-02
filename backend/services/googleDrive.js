import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';
import { ExternalServiceError } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let oauth2Client;
let drive;

// Folder IDs from environment
const FOLDERS = {
  powerbi: process.env.GOOGLE_DRIVE_POWERBI_FOLDER_ID,
  documentation: process.env.GOOGLE_DRIVE_DOCUMENTATION_FOLDER_ID,
  skills: process.env.GOOGLE_DRIVE_SKILLS_FOLDER_ID,
  scripts: process.env.GOOGLE_DRIVE_SCRIPTS_FOLDER_ID,
  temp: process.env.GOOGLE_DRIVE_TEMP_FOLDER_ID,
};

export async function initializeGoogleDrive() {
  try {
    oauth2Client = new OAuth2Client(
      process.env.GOOGLE_DRIVE_CLIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URI
    );

    // Try to load existing tokens
    try {
      const tokenPath = path.join(__dirname, '../../.google-tokens.json');
      const tokens = JSON.parse(await fs.readFile(tokenPath, 'utf8'));
      oauth2Client.setCredentials(tokens);
      logger.info('Loaded existing Google Drive tokens');
    } catch (error) {
      logger.warn('No existing Google Drive tokens found. Manual auth required.');
    }

    drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    logger.info('Google Drive service initialized');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Google Drive:', error);
    throw new ExternalServiceError('Google Drive', error.message);
  }
}

export function getAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/drive.readonly'];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

export async function handleAuthCallback(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens for future use
    const tokenPath = path.join(__dirname, '../../.google-tokens.json');
    await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));

    logger.info('Google Drive authenticated successfully');
    return tokens;
  } catch (error) {
    logger.error('Google Drive authentication failed:', error);
    throw new ExternalServiceError('Google Drive', 'Authentication failed');
  }
}

export async function listFilesInFolder(folderId, mimeType = null) {
  try {
    let query = `'${folderId}' in parents and trashed=false`;
    if (mimeType) {
      query += ` and mimeType='${mimeType}'`;
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
      orderBy: 'name',
    });

    return response.data.files || [];
  } catch (error) {
    logger.error(`Failed to list files in folder ${folderId}:`, error);
    throw new ExternalServiceError('Google Drive', 'Failed to list files');
  }
}

export async function listPBIXFiles() {
  try {
    // List all files in PowerBI folder and subfolders
    const files = await listFilesInFolder(FOLDERS.powerbi);
    
    // Filter for PBIX files and organize by folder
    const pbixFiles = [];
    
    for (const file of files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        // It's a subfolder, list files in it
        const subFiles = await listFilesInFolder(file.id);
        const pbixInFolder = subFiles.filter(f => f.name.endsWith('.pbix'));
        
        pbixFiles.push({
          category: file.name,
          files: pbixInFolder,
        });
      } else if (file.name.endsWith('.pbix')) {
        // It's a PBIX file in root
        pbixFiles.push({
          category: 'Root',
          files: [file],
        });
      }
    }

    return pbixFiles;
  } catch (error) {
    logger.error('Failed to list PBIX files:', error);
    throw new ExternalServiceError('Google Drive', 'Failed to list PBIX files');
  }
}

export async function downloadFile(fileId, destinationPath) {
  try {
    const dest = fs.createWriteStream(destinationPath);
    
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => {
          logger.info(`Downloaded file ${fileId} to ${destinationPath}`);
          resolve(destinationPath);
        })
        .on('error', (err) => {
          logger.error(`Error downloading file ${fileId}:`, err);
          reject(err);
        })
        .pipe(dest);
    });
  } catch (error) {
    logger.error(`Failed to download file ${fileId}:`, error);
    throw new ExternalServiceError('Google Drive', 'Failed to download file');
  }
}

export async function uploadFile(filePath, fileName, folderId) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: 'application/octet-stream',
      body: await fs.readFile(filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    });

    logger.info(`Uploaded file ${fileName} to folder ${folderId}`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to upload file ${fileName}:`, error);
    throw new ExternalServiceError('Google Drive', 'Failed to upload file');
  }
}

export async function deleteFile(fileId) {
  try {
    await drive.files.delete({ fileId });
    logger.info(`Deleted file ${fileId}`);
    return true;
  } catch (error) {
    logger.error(`Failed to delete file ${fileId}:`, error);
    throw new ExternalServiceError('Google Drive', 'Failed to delete file');
  }
}

export async function syncFolderToLocal(folderId, localPath) {
  try {
    // Ensure local directory exists
    await fs.mkdir(localPath, { recursive: true });

    // List files in Google Drive folder
    const files = await listFilesInFolder(folderId);

    const downloadedFiles = [];

    for (const file of files) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        // Recursively sync subfolders
        const subPath = path.join(localPath, file.name);
        await syncFolderToLocal(file.id, subPath);
      } else {
        // Download file
        const filePath = path.join(localPath, file.name);
        await downloadFile(file.id, filePath);
        downloadedFiles.push(filePath);
      }
    }

    logger.info(`Synced ${downloadedFiles.length} files from folder ${folderId}`);
    return downloadedFiles;
  } catch (error) {
    logger.error(`Failed to sync folder ${folderId}:`, error);
    throw new ExternalServiceError('Google Drive', 'Failed to sync folder');
  }
}

export async function syncAllFolders() {
  try {
    const results = {
      documentation: await syncFolderToLocal(
        FOLDERS.documentation,
        path.join(__dirname, '../../docs')
      ),
      skills: await syncFolderToLocal(
        FOLDERS.skills,
        path.join(__dirname, '../../skills')
      ),
      scripts: await syncFolderToLocal(
        FOLDERS.scripts,
        path.join(__dirname, '../../scripts')
      ),
    };

    logger.info('All folders synced successfully');
    return results;
  } catch (error) {
    logger.error('Failed to sync all folders:', error);
    throw error;
  }
}

export { FOLDERS, drive, oauth2Client };
