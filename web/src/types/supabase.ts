/**
 * Supabase Auth type definitions
 * Type-safe interfaces for Supabase authentication
 */

import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * User type from Supabase Auth
 */
export type User = SupabaseUser;

/**
 * Session type from Supabase Auth
 */
export type Session = SupabaseSession;

/**
 * User metadata type
 */
export interface UserMetadata {
  name?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

/**
 * Auth result type
 */
export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

/**
 * Session result type
 */
export interface SessionResult {
  user: User | null;
  session: Session | null;
}
