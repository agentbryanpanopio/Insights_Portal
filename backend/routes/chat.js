import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';
import {
  generateResponse,
  buildSystemPrompt,
  buildChatMessages,
  generateReportSummary,
  formatReportContext,
} from '../services/claudeAI.js';
import { getMetadata, executeDAXQuery } from '../services/mcpServer.js';
import { uploadFile, FOLDERS } from '../services/googleDrive.js';
import logger from '../config/logger.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// In-memory session storage (in production, use Redis or database)
const chatSessions = new Map();

// Create new chat session
router.post('/session', authenticateToken, async (req, res, next) => {
  try {
    const { reportName, connectionName } = req.body;
    
    const sessionId = uuidv4();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    const session = {
      id: sessionId,
      userId: req.user.id,
      reportName: reportName || 'Unknown Report',
      connectionName,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      chatHistoryFile: `chat_${timestamp}_${sessionId}.txt`,
    };

    chatSessions.set(sessionId, session);

    logger.info(`New chat session created: ${sessionId} for user ${req.user.email}`);

    res.json({
      sessionId,
      reportName: session.reportName,
      chatHistoryFile: session.chatHistoryFile,
    });
  } catch (error) {
    next(error);
  }
});

// Send message to Aiko
router.post('/message', authenticateToken, chatRateLimiter, async (req, res, next) => {
  try {
    const { sessionId, message, connectionName } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        error: 'Session ID and message are required',
      });
    }

    const session = chatSessions.get(sessionId);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({
        error: 'Session not found',
      });
    }

    logger.info(`Message received in session ${sessionId}: ${message.substring(0, 50)}...`);

    // Get report metadata if connection exists
    let metadata = null;
    let reportContext = null;
    if (connectionName) {
      try {
        metadata = await getMetadata(connectionName);
        reportContext = formatReportContext(metadata, { 
          name: session.reportName,
          modifiedTime: new Date(),
        });
      } catch (error) {
        logger.warn('Could not fetch report metadata:', error);
      }
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(reportContext);

    // Build messages array
    const messages = buildChatMessages(session.messages, message);

    // Generate AI response
    const aiResponse = await generateResponse(messages, systemPrompt);

    // Update session
    session.messages.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: aiResponse.content, timestamp: new Date() }
    );
    session.lastActivity = new Date();

    // Save to chat history file
    await saveChatHistory(session);

    logger.info(`AI response generated for session ${sessionId}`);

    res.json({
      message: aiResponse.content,
      usage: aiResponse.usage,
      sessionId,
    });
  } catch (error) {
    next(error);
  }
});

// Get chat history
router.get('/history/:sessionId', authenticateToken, async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = chatSessions.get(sessionId);
    if (!session || session.userId !== req.user.id) {
      return res.status(404).json({
        error: 'Session not found',
      });
    }

    res.json({
      sessionId,
      messages: session.messages,
      reportName: session.reportName,
      createdAt: session.createdAt,
      chatHistoryFile: session.chatHistoryFile,
    });
  } catch (error) {
    next(error);
  }
});

// Get report summary
router.post('/summary', authenticateToken, async (req, res, next) => {
  try {
    const { connectionName } = req.body;

    if (!connectionName) {
      return res.status(400).json({
        error: 'Connection name is required',
      });
    }

    logger.info(`Generating summary for connection: ${connectionName}`);

    const metadata = await getMetadata(connectionName);
    const summary = await generateReportSummary(metadata);

    res.json({
      summary,
      metadata: {
        tableCount: metadata.tables?.length || 0,
        measureCount: metadata.measures?.length || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Execute data query
router.post('/query', authenticateToken, async (req, res, next) => {
  try {
    const { connectionName, question } = req.body;

    if (!connectionName || !question) {
      return res.status(400).json({
        error: 'Connection name and question are required',
      });
    }

    logger.info(`Data query for connection ${connectionName}: ${question}`);

    // In a real implementation, this would:
    // 1. Use Claude to understand the question
    // 2. Generate appropriate DAX query
    // 3. Execute query via MCP
    // 4. Format results

    // For now, return placeholder
    res.json({
      question,
      answer: 'Query functionality will be implemented with MCP integration',
      data: [],
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to save chat history
async function saveChatHistory(session) {
  try {
    const docsDir = path.join(__dirname, '../../docs/chat_history');
    await fs.mkdir(docsDir, { recursive: true });

    const filePath = path.join(docsDir, session.chatHistoryFile);

    let content = `CHAT HISTORY\n`;
    content += `Session ID: ${session.id}\n`;
    content += `Report: ${session.reportName}\n`;
    content += `Date: ${session.createdAt.toISOString()}\n`;
    content += `\n${'='.repeat(80)}\n\n`;

    for (const msg of session.messages) {
      const timestamp = msg.timestamp.toLocaleString();
      const role = msg.role === 'user' ? 'USER' : 'AIKO';
      content += `[${timestamp}] ${role}:\n${msg.content}\n\n`;
    }

    await fs.writeFile(filePath, content, 'utf8');

    // Also upload to Google Drive Documentation folder
    try {
      await uploadFile(filePath, session.chatHistoryFile, FOLDERS.documentation);
    } catch (error) {
      logger.warn('Failed to upload chat history to Google Drive:', error);
    }
  } catch (error) {
    logger.error('Failed to save chat history:', error);
  }
}

// Clean up old sessions (run periodically)
setInterval(() => {
  const timeout = parseInt(process.env.CHAT_SESSION_TIMEOUT) || 30; // minutes
  const now = Date.now();

  for (const [sessionId, session] of chatSessions.entries()) {
    const inactiveTime = now - session.lastActivity.getTime();
    if (inactiveTime > timeout * 60 * 1000) {
      chatSessions.delete(sessionId);
      logger.info(`Cleaned up inactive session: ${sessionId}`);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

export default router;
