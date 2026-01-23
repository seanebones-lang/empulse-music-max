/**
 * Authentication utilities using Supabase Auth
 * 
 * Provides functions for user authentication, session management, and protected routes.
 * 
 * @module lib/auth
 */

import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

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
 * @returns {Promise<{ user: any; session: any } | null>} User session or null
 */
export async function getSession() {
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
 * @returns {Promise<{ user: any; session: any; error: Error | null }>} Sign in result
 */
export async function signIn(email: string, password: string) {
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
 * @param {Record<string, any>} metadata - Optional user metadata
 * @returns {Promise<{ user: any; session: any; error: Error | null }>} Sign up result
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>
) {
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
 * @returns {Promise<any | null>} Current user or null
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
