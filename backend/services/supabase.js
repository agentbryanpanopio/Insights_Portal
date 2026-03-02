import { createClient } from '@supabase/supabase-js';
import logger from '../config/logger.js';
import { ExternalServiceError, AuthenticationError } from '../middleware/errorHandler.js';

let supabase;

export async function initializeSupabase() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found in environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    logger.info('Supabase client initialized');
    return supabase;
  } catch (error) {
    logger.error('Failed to initialize Supabase:', error);
    throw new ExternalServiceError('Supabase', error.message);
  }
}

export async function signUp(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName || email.split('@')[0],
          ...metadata,
        },
      },
    });

    if (error) throw error;

    logger.info(`New user signed up: ${email}`);
    return data;
  } catch (error) {
    logger.error('Signup failed:', error);
    throw new AuthenticationError(error.message);
  }
}

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    logger.info(`User signed in: ${email}`);
    return data;
  } catch (error) {
    logger.error('Sign in failed:', error);
    throw new AuthenticationError('Invalid email or password');
  }
}

export async function signOut(userId) {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    logger.info(`User signed out: ${userId}`);
    return true;
  } catch (error) {
    logger.error('Sign out failed:', error);
    throw new ExternalServiceError('Supabase', 'Sign out failed');
  }
}

export async function getCurrentUser(accessToken) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error) throw error;

    return user;
  } catch (error) {
    logger.error('Failed to get current user:', error);
    throw new AuthenticationError('Invalid or expired token');
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) throw error;

    logger.info(`User profile updated: ${userId}`);
    return data;
  } catch (error) {
    logger.error('Failed to update user profile:', error);
    throw new ExternalServiceError('Supabase', 'Failed to update profile');
  }
}

export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (error) throw error;

    logger.info(`Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Password reset failed:', error);
    throw new ExternalServiceError('Supabase', 'Failed to send reset email');
  }
}

export async function saveChatHistory(userId, sessionId, messages) {
  try {
    // This would save to a Supabase table if we create one
    // For now, we'll handle this in the chat service with file storage
    logger.info(`Chat history saved for user ${userId}, session ${sessionId}`);
    return true;
  } catch (error) {
    logger.error('Failed to save chat history:', error);
    throw error;
  }
}

export async function getChatHistory(userId, sessionId) {
  try {
    // This would retrieve from Supabase table
    // For now, handled in chat service with file storage
    return [];
  } catch (error) {
    logger.error('Failed to get chat history:', error);
    throw error;
  }
}

export { supabase };
