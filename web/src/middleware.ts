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
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // For protected routes, check authentication
  // In a real implementation, you would check the session here
  // For now, we'll allow access but add headers for future auth checks
  if (isProtectedRoute) {
    // Check for auth token in cookies or headers
    const authToken = request.cookies.get('sb-access-token')?.value ||
                      request.headers.get('authorization');
    
    // If no auth token and route is protected, you could redirect to login
    // For now, we'll just add a header indicating auth status
    const response = NextResponse.next();
    response.headers.set('X-Auth-Required', 'true');
    response.headers.set('X-Auth-Status', authToken ? 'authenticated' : 'unauthenticated');
    
    return response;
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
