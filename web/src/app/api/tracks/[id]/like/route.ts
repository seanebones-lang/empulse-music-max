/**
 * API Route: Like/Unlike a track
 * POST /api/tracks/[id]/like - Like a track
 * DELETE /api/tracks/[id]/like - Unlike a track
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import type { LikeResponse } from '@/types/likes';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

/**
 * POST - Like a track
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Rate limiting
  const rateLimit = checkRateLimit(request, 30, 60 * 1000); // 30 likes per minute
  if (!rateLimit.allowed) {
    return errorResponse('Rate limit exceeded', 429, 'Too many requests. Please try again later.');
  }

  try {
    // Handle Next.js 15+ async params
    const resolvedParams = params instanceof Promise ? await params : params;
    
    // Get user from request (from auth middleware or session)
    const authHeader = request.headers.get('authorization');
    const userId = request.headers.get('x-user-id'); // Set by middleware after auth verification
    
    if (!userId && !authHeader) {
      return errorResponse('Unauthorized', 401, 'Authentication required');
    }

    const trackId = resolvedParams?.id;

    // Validate trackId - check for undefined, null, or empty string
    if (!trackId || typeof trackId !== 'string' || trackId.trim().length === 0) {
      return errorResponse('Track ID required', 400, 'Track ID is missing or invalid');
    }

    // If Supabase is configured, save to database
    if (supabase) {
      // Get authenticated user from Supabase
      const authToken = authHeader?.replace('Bearer ', '');
      if (authToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
        
        if (authError || !user) {
          return errorResponse('Unauthorized', 401, 'Invalid authentication');
        }

        // Check if already liked
        const { data: existingLike } = await supabase
          .from('user_likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('track_id', trackId)
          .single();

        if (existingLike) {
          return successResponse<LikeResponse>({
            success: true,
            is_liked: true,
            like_id: existingLike.id,
            message: 'Track already liked',
          });
        }

        // Create like
        const { data: like, error } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            track_id: trackId,
          })
          .select('id')
          .single();

        if (error) {
          logger.error('Error creating like:', error);
          return errorResponse(error, 500, 'Failed to like track');
        }

        return successResponse<LikeResponse>({
          success: true,
          is_liked: true,
          like_id: like.id,
        });
      }
    }

    // Fallback: Return success (for development without database)
    logger.warn('Like track: Supabase not configured, returning mock success');
    return successResponse<LikeResponse>({
      success: true,
      is_liked: true,
      like_id: `mock-like-${trackId}-${Date.now()}`,
    });
  } catch (error) {
    return handleApiError(error, 'Like Track API');
  }
}

/**
 * DELETE - Unlike a track
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Rate limiting
  const rateLimit = checkRateLimit(request, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return errorResponse('Rate limit exceeded', 429, 'Too many requests. Please try again later.');
  }

  try {
    // Handle Next.js 15+ async params
    const resolvedParams = params instanceof Promise ? await params : params;
    const authHeader = request.headers.get('authorization');
    const trackId = resolvedParams?.id;

    // Validate trackId - check for undefined, null, or empty string
    if (!trackId || typeof trackId !== 'string' || trackId.trim().length === 0) {
      return errorResponse('Track ID required', 400, 'Track ID is missing or invalid');
    }

    // If Supabase is configured, delete from database
    if (supabase) {
      const authToken = authHeader?.replace('Bearer ', '');
      if (authToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
        
        if (authError || !user) {
          return errorResponse('Unauthorized', 401, 'Invalid authentication');
        }

        // Delete like
        const { error } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId);

        if (error) {
          logger.error('Error deleting like:', error);
          return errorResponse(error, 500, 'Failed to unlike track');
        }

        return successResponse<LikeResponse>({
          success: true,
          is_liked: false,
        });
      }
    }

    // Fallback: Return success (for development)
    logger.warn('Unlike track: Supabase not configured, returning mock success');
    return successResponse<LikeResponse>({
      success: true,
      is_liked: false,
    });
  } catch (error) {
    return handleApiError(error, 'Unlike Track API');
  }
}

/**
 * GET - Check if track is liked
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle Next.js 15+ async params
    const resolvedParams = params instanceof Promise ? await params : params;
    const authHeader = request.headers.get('authorization');
    const trackId = resolvedParams?.id;

    // Validate trackId - check for undefined, null, or empty string
    if (!trackId || typeof trackId !== 'string' || trackId.trim().length === 0) {
      return errorResponse('Track ID required', 400, 'Track ID is missing or invalid');
    }

    // If Supabase is configured, check database
    if (supabase) {
      const authToken = authHeader?.replace('Bearer ', '');
      if (authToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
        
        if (authError || !user) {
          return successResponse<LikeResponse>({
            success: true,
            is_liked: false,
          });
        }

        // Check if liked
        const { data: like } = await supabase
          .from('user_likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('track_id', trackId)
          .single();

        return successResponse<LikeResponse>({
          success: true,
          is_liked: !!like,
          like_id: like?.id,
        });
      }
    }

    // Fallback: Return not liked (for development)
    return successResponse<LikeResponse>({
      success: true,
      is_liked: false,
    });
  } catch (error) {
    return handleApiError(error, 'Check Like Status API');
  }
}
