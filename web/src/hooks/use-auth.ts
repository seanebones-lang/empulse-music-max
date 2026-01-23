/**
 * Authentication hook
 * 
 * Provides authentication state and methods for React components.
 * 
 * @module hooks/use-auth
 */

import { useState, useEffect } from 'react';
import { getSession, signIn, signUp, signOut, getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

/**
 * User type definition
 */
export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Type guard to check if object is a User
 */
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

/**
 * Authentication state
 */
interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

/**
 * Authentication methods
 */
interface AuthMethods {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Authentication hook return type
 */
export type UseAuthReturn = AuthState & AuthMethods;

/**
 * Custom hook for authentication
 * 
 * @returns {UseAuthReturn} Authentication state and methods
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, authenticated, signIn, signOut } = useAuth();
 *   
 *   if (!authenticated) {
 *     return <LoginForm onSignIn={signIn} />;
 *   }
 *   
 *   return <div>Welcome, {user?.email}</div>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Load user session on mount
   */
  useEffect(() => {
    loadSession();
  }, []);

  /**
   * Load user session
   */
  const loadSession = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (session && isUser(session.user)) {
        setUser(session.user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      logger.error('Error loading session:', error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in handler
   */
  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      if (result.error) {
        return { error: result.error };
      }
      await loadSession();
      return { error: null };
    } catch (error) {
      logger.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  /**
   * Sign up handler
   */
  const handleSignUp = async (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const result = await signUp(email, password, metadata);
      if (result.error) {
        return { error: result.error };
      }
      await loadSession();
      return { error: null };
    } catch (error) {
      logger.error('Sign up error:', error);
      return { error: error as Error };
    }
  };

  /**
   * Sign out handler
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  };

  /**
   * Refresh session
   */
  const refresh = async () => {
    await loadSession();
  };

  return {
    user,
    loading,
    authenticated,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    refresh,
  };
}
