import { createSupabaseClient } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * OAuth callback handler
 * Handles OAuth redirects from providers (Google, GitHub, etc.)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabase = createSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Successful authentication, redirect to home or next URL
        return NextResponse.redirect(new URL(next, request.url));
      }
    }
  }

  // If there's an error or no code, redirect to login with error
  return NextResponse.redirect(new URL('/auth/login?error=oauth_error', request.url));
}
