import express from 'express';
import { signUp, signIn, signOut, getCurrentUser, resetPassword } from '../services/supabase.js';
import { getAuthUrl, handleAuthCallback } from '../services/googleDrive.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import { ValidationError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';

const router = express.Router();

// Sign up
router.post('/signup', authRateLimiter, async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const data = await signUp(email, password, { fullName });

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Sign in
router.post('/signin', authRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const data = await signIn(email, password);
    const token = generateToken(data.user);

    res.json({
      message: 'Signed in successfully',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Sign out
router.post('/signout', authenticateToken, async (req, res, next) => {
  try {
    await signOut(req.user.id);

    res.json({
      message: 'Signed out successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    res.json({
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// Reset password
router.post('/reset-password', authRateLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    await resetPassword(email);

    res.json({
      message: 'Password reset email sent',
    });
  } catch (error) {
    next(error);
  }
});

// Google Drive OAuth - Get auth URL
router.get('/google/url', authenticateToken, async (req, res, next) => {
  try {
    const authUrl = getAuthUrl();

    res.json({
      authUrl,
    });
  } catch (error) {
    next(error);
  }
});

// Google Drive OAuth - Handle callback
router.get('/google/callback', async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      throw new ValidationError('Authorization code is required');
    }

    await handleAuthCallback(code);

    res.redirect(`${process.env.FRONTEND_URL}?google_auth=success`);
  } catch (error) {
    logger.error('Google OAuth callback failed:', error);
    res.redirect(`${process.env.FRONTEND_URL}?google_auth=error`);
  }
});

export default router;
