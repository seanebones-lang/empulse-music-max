/**
 * Authentication utilities using Supabase Auth
 * 
 * Provides functions for user authentication, session management, and protected routes.
 * 
 * @module lib/auth
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';
import type { User, Session, AuthResult, SessionResult } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Create Supabase client for authentication
 * 
 * @returns {ReturnType<typeof createClient> | null} Supabase client or null if not configured
 */
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    logger.warn('Supabase credentials not configured. Authentication will be disabled.');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Get current user session
 * 
 * @returns {Promise<SessionResult | null>} User session or null
 */
export async function getSession(): Promise<SessionResult | null> {
  const supabase = createSupabaseClient();
  if (!supabase) return null;
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      logger.error('Error getting session:', error);
      return null;
    }
    return session ? { user: session.user, session } : null;
  } catch (error) {
    logger.error('Error getting session:', error);
    return null;
  }
}

/**
 * Sign in with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<AuthResult>} Sign in result
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { user: null, session: null, error: new Error('Supabase not configured') };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      logger.error('Sign in error:', error);
      return { user: null, session: null, error };
    }
    
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    logger.error('Sign in error:', error);
    return { user: null, session: null, error: error as Error };
  }
}

/**
 * Sign up with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Record<string, unknown>} metadata - Optional user metadata
 * @returns {Promise<AuthResult>} Sign up result
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
): Promise<AuthResult> {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { user: null, session: null, error: new Error('Supabase not configured') };
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) {
      logger.error('Sign up error:', error);
      return { user: null, session: null, error };
    }
    
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    logger.error('Sign up error:', error);
    return { user: null, session: null, error: error as Error };
  }
}

/**
 * Sign out current user
 * 
 * @returns {Promise<{ error: Error | null }>} Sign out result
 */
export async function signOut() {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Sign out error:', error);
      return { error };
    }
    return { error: null };
  } catch (error) {
    logger.error('Sign out error:', error);
    return { error: error as Error };
  }
}

/**
 * Check if user is authenticated
 * 
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Get current user
 * 
 * @returns {Promise<User | null>} Current user or null
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Reset password - sends password reset email
 * 
 * @param {string} email - User email
 * @returns {Promise<{ error: Error | null }>} Reset result
 */
export async function resetPassword(email: string) {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    });
    
    if (error) {
      logger.error('Password reset error:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    logger.error('Password reset error:', error);
    return { error: error as Error };
  }
}

/**
 * Update password
 * 
 * @param {string} newPassword - New password
 * @returns {Promise<{ error: Error | null }>} Update result
 */
export async function updatePassword(newPassword: string) {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      logger.error('Password update error:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    logger.error('Password update error:', error);
    return { error: error as Error };
  }
}

/**
 * Sign in with OAuth provider
 * 
 * @param {string} provider - OAuth provider (google, github, etc.)
 * @param {string} redirectTo - Redirect URL after auth
 * @returns {Promise<{ error: Error | null }>} Sign in result
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord', redirectTo?: string) {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${origin}/auth/callback`,
      },
    });
    
    if (error) {
      logger.error('OAuth sign in error:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    logger.error('OAuth sign in error:', error);
    return { error: error as Error };
  }
}

/**
 * Verify email with token
 * 
 * @param {string} token - Email verification token
 * @returns {Promise<{ error: Error | null }>} Verification result
 */
export async function verifyEmail(token: string) {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });
    
    if (error) {
      logger.error('Email verification error:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    logger.error('Email verification error:', error);
    return { error: error as Error };
  }
}

/**
 * Resend email verification
 * 
 * @param {string} email - User email
 * @returns {Promise<{ error: Error | null }>} Resend result
 */
export async function resendVerificationEmail(email: string) {
  const supabase = createSupabaseClient();
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }
  
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${origin}/auth/verify-email`,
      },
    });
    
    if (error) {
      logger.error('Resend verification error:', error);
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    logger.error('Resend verification error:', error);
    return { error: error as Error };
  }
}
