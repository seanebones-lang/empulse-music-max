'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './auth-provider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component
 * 
 * Wraps routes that require authentication. Redirects to login if user is not authenticated.
 * 
 * @param children - Content to render if authenticated
 * @param redirectTo - Where to redirect if not authenticated (default: '/auth/login')
 * @param requireAuth - Whether authentication is required (default: true)
 */
export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
}: ProtectedRouteProps) {
  const { authenticated, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !authenticated) {
      // Store the current path to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [authenticated, loading, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-indigo-950">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required and user is not authenticated, don't render children
  // (redirect will happen in useEffect)
  if (requireAuth && !authenticated) {
    return null;
  }

  return <>{children}</>;
}
