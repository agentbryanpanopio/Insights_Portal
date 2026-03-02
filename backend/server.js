import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import reportsRoutes from './routes/reports.js';
import chatRoutes from './routes/chat.js';
import syncRoutes from './routes/sync.js';
import driveRoutes from './routes/drive.js';

// Import services
import { initializeGoogleDrive } from './services/googleDrive.js';
import { initializeSupabase } from './services/supabase.js';
import { initializeMCPServer } from './services/mcpServer.js';
import { startSyncScheduler } from './services/syncScheduler.js';
import logger from './config/logger.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// ES Module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ========================================
// MIDDLEWARE
// ========================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", process.env.SUPABASE_URL, 'https://api.anthropic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Rate limiting
app.use('/api', rateLimiter);

// ========================================
// ROUTES
// ========================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/drive', driveRoutes);

// Serve static files from docs, skills, scripts folders
app.use('/docs', express.static(path.join(__dirname, '../docs')));
app.use('/skills', express.static(path.join(__dirname, '../skills')));
app.use('/scripts', express.static(path.join(__dirname, '../scripts')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ========================================
// SERVER INITIALIZATION
// ========================================

async function startServer() {
  try {
    logger.info('🚀 Starting Aiko Insights Portal Backend...');

    // Initialize services
    logger.info('📦 Initializing services...');
    
    await initializeSupabase();
    logger.info('✅ Supabase initialized');

    await initializeGoogleDrive();
    logger.info('✅ Google Drive initialized');

    await initializeMCPServer();
    logger.info('✅ MCP Server initialized');

    // Start sync scheduler if enabled
    if (process.env.SYNC_ON_STARTUP === 'true') {
      logger.info('🔄 Starting sync scheduler...');
      await startSyncScheduler();
      logger.info('✅ Sync scheduler started');
    }

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`✨ Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api`);
      logger.info(`❤️  Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;
