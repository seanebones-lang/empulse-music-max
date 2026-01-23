/**
 * API Route: Get user's liked tracks
 * GET /api/tracks/liked - Get all tracks liked by the current user
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateRequest, trackSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';
import type { Track } from '@/store/player-store';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimit = checkRateLimit(request, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return errorResponse('Rate limit exceeded', 429, 'Too many requests. Please try again later.');
  }

  try {
    const authHeader = request.headers.get('authorization');

    // If Supabase is configured, fetch from database
    if (supabase) {
      const authToken = authHeader?.replace('Bearer ', '');
      if (authToken) {
        const { data: { user }, error: authError } = await supabase.auth.getUser(authToken);
        
        if (authError || !user) {
          return errorResponse('Unauthorized', 401, 'Authentication required');
        }

        // Get user's liked tracks
        const { data: likes, error: likesError } = await supabase
          .from('user_likes')
          .select('track_id')
          .eq('user_id', user.id);

        if (likesError) {
          logger.error('Error fetching likes:', likesError);
          return errorResponse(likesError, 500, 'Failed to fetch liked tracks');
        }

        if (!likes || !Array.isArray(likes) || likes.length === 0) {
          return successResponse<Track[]>([]);
        }

        // Get track details for liked tracks
        // Edge case: Filter out invalid track_ids
        const trackIds = likes
          .map(like => like?.track_id)
          .filter((id): id is string => typeof id === 'string' && id.trim().length > 0);
        
        if (trackIds.length === 0) {
          return successResponse<Track[]>([]);
        }
        
        const { data: tracks, error: tracksError } = await supabase
          .from('tracks')
          .select('*')
          .in('id', trackIds);

        if (tracksError) {
          logger.error('Error fetching tracks:', tracksError);
          return errorResponse(tracksError, 500, 'Failed to fetch track details');
        }

        // Validate tracks
        if (tracks && Array.isArray(tracks)) {
          const validatedTracks: Track[] = [];
          for (const item of tracks) {
            const validation = validateRequest(trackSchema, item);
            if (validation.success && validation.data) {
              validatedTracks.push(validation.data);
            } else {
              logger.warn('Invalid track data:', validation.error, item);
            }
          }
          return successResponse(validatedTracks);
        }

        return successResponse<Track[]>([]);
      }
    }

    // Fallback: Return empty array (for development)
    logger.warn('Get liked tracks: Supabase not configured, returning empty array');
    return successResponse<Track[]>([]);
  } catch (error) {
    return handleApiError(error, 'Liked Tracks API');
  }
}
