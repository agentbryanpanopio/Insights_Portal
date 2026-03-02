import jwt from 'jsonwebtoken';
import { AuthenticationError } from './errorHandler.js';
import logger from '../config/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.warn(`Invalid token attempt from IP: ${req.ip}`);
        throw new AuthenticationError('Invalid or expired token');
      }

      // Attach user to request
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );
};
