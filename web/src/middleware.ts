/**
 * Next.js Middleware
 * 
 * Handles authentication and route protection.
 * 
 * @module middleware
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protected routes that require authentication
 */
const protectedRoutes = [
  '/artist/dashboard',
  '/artist/upload',
  '/profile',
  '/settings',
  '/library',
  '/premium',
];

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  '/',
  '/search',
  '/artist/signup',
  '/onboarding',
];

/**
 * Middleware function to handle authentication and route protection
 * 
 * @param {NextRequest} request - The incoming request
 * @returns {NextResponse} Response with appropriate headers or redirect
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Check if route is public (auth pages)
  const isAuthRoute = pathname.startsWith('/auth');
  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route)
  );
  
  // For protected routes, check authentication
  if (isProtectedRoute) {
    // Check for Supabase session in cookies
    const accessToken = request.cookies.get('sb-access-token')?.value;
    const refreshToken = request.cookies.get('sb-refresh-token')?.value;
    
    // If no tokens, redirect to login
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Add auth headers for API routes
    const response = NextResponse.next();
    response.headers.set('X-Auth-Required', 'true');
    response.headers.set('X-Auth-Status', 'authenticated');
    return response;
  }
  
  // If user is authenticated and tries to access auth pages, redirect to home
  if (isAuthRoute && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

/**
 * Config for middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
