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

  // If Supabase is configured, fetch from database
  if (supabase) {
    try {
      const { data, error } = await supabase.from('tracks').select('*');
      if (error) {
        logger.error('Supabase error:', error);
        return errorResponse(error, 500, 'Failed to fetch tracks from database');
      }

      // Validate response data
      if (data && Array.isArray(data)) {
        const validatedTracks: Track[] = [];
        for (const item of data) {
          const validation = validateRequest(trackSchema, item);
          if (validation.success && validation.data) {
            validatedTracks.push(validation.data);
          } else {
            logger.warn('Invalid track data:', validation.error, item);
          }
        }
        return successResponse(validatedTracks);
      }

      return successResponse([]);
    } catch (error) {
      return handleApiError(error, 'Tracks API');
    }
  }

  // Fallback: Return mock data (for development)
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'EmPulse Beat 1',
      artist: 'RE Artist',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artwork: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Track+1',
      duration: 210,
    },
    {
      id: '2',
      title: 'Max Groove',
      artist: 'AI Mix',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artwork: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Track+2',
      duration: 180,
    },
    {
      id: '3',
      title: 'Ultra Wave',
      artist: 'Digital Dreams',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      artwork: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Track+3',
      duration: 195,
    },
    {
      id: '4',
      title: 'Neon Pulse',
      artist: 'Synth Master',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      artwork: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Track+4',
      duration: 200,
    },
  ];

  logger.warn('Using mock tracks data (Supabase not configured)');
  return successResponse(mockTracks);
}
