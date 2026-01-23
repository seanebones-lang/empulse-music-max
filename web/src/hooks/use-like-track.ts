/**
 * Hook for liking/unliking tracks
 * Provides optimistic updates and error handling
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import type { LikeResponse } from '@/types/likes';

/**
 * Like a track
 */
async function likeTrack(trackId: string, authToken?: string): Promise<LikeResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`/api/tracks/${trackId}/like`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to like track');
  }

  const data = await response.json();
  
  // Edge case: data.data might be undefined
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  
  // Fallback: return data directly if it's already the response
  return data;
}

/**
 * Unlike a track
 */
async function unlikeTrack(trackId: string, authToken?: string): Promise<LikeResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`/api/tracks/${trackId}/like`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to unlike track');
  }

  const data = await response.json();
  
  // Edge case: data.data might be undefined
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  
  // Fallback: return data directly if it's already the response
  return data;
}

/**
 * Check if track is liked
 */
async function checkLikeStatus(trackId: string, authToken?: string): Promise<LikeResponse> {
  const headers: HeadersInit = {};

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`/api/tracks/${trackId}/like`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    // If not authenticated, return not liked
    if (response.status === 401) {
      return { success: true, is_liked: false };
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Failed to check like status');
  }

  const data = await response.json();
  
  // Edge case: data.data might be undefined
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  
  // Fallback: return data directly if it's already the response
  return data;
}

/**
 * Hook for liking/unliking a single track
 */
export function useLikeTrack(trackId: string) {
  // Validate trackId early
  if (!trackId || typeof trackId !== 'string' || trackId.trim().length === 0) {
    logger.warn('useLikeTrack called with invalid trackId:', trackId);
    return {
      isLiked: false,
      isLoading: false,
      toggleLike: () => {},
      like: () => {},
      unlike: () => {},
    };
  }

  const { authenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth token from Supabase session
  const getAuthToken = useCallback(async () => {
    if (!authenticated) return undefined;
    
    try {
      const { getSession } = await import('@/lib/auth');
      const session = await getSession();
      return session?.session?.access_token;
    } catch (error) {
      logger.error('Error getting auth token:', error);
      return undefined;
    }
  }, [authenticated]);

  // Check like status on mount
  useQuery({
    queryKey: ['track-like-status', trackId],
    queryFn: async () => {
      if (!authenticated) {
        return { success: true, is_liked: false };
      }
      const token = await getAuthToken();
      return checkLikeStatus(trackId, token);
    },
    enabled: !!trackId,
    onSuccess: (data) => {
      setIsLiked(data.is_liked);
    },
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!authenticated) {
        throw new Error('Please sign in to like tracks');
      }
      const token = await getAuthToken();
      return likeTrack(trackId, token);
    },
    onMutate: async () => {
      // Optimistic update
      setIsLiked(true);
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLiked(data.is_liked);
      setIsLoading(false);
      toast.success('Track liked');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['track-like-status', trackId] });
      queryClient.invalidateQueries({ queryKey: ['liked-tracks'] });
    },
    onError: (error) => {
      // Rollback optimistic update
      setIsLiked(false);
      setIsLoading(false);
      logger.error('Error liking track:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to like track');
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      if (!authenticated) {
        throw new Error('Please sign in to unlike tracks');
      }
      const token = await getAuthToken();
      return unlikeTrack(trackId, token);
    },
    onMutate: async () => {
      // Optimistic update
      setIsLiked(false);
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLiked(data.is_liked);
      setIsLoading(false);
      toast.success('Track unliked');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['track-like-status', trackId] });
      queryClient.invalidateQueries({ queryKey: ['liked-tracks'] });
    },
    onError: (error) => {
      // Rollback optimistic update
      setIsLiked(true);
      setIsLoading(false);
      logger.error('Error unliking track:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to unlike track');
    },
  });

  const toggleLike = useCallback(() => {
    if (!authenticated) {
      toast.error('Please sign in to like tracks');
      return;
    }

    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  }, [isLiked, authenticated, likeMutation, unlikeMutation]);

  return {
    isLiked,
    isLoading: isLoading || likeMutation.isPending || unlikeMutation.isPending,
    toggleLike,
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
  };
}

/**
 * Hook for fetching all liked tracks
 */
export function useLikedTracks() {
  const { authenticated } = useAuth();
  const getAuthToken = useCallback(async () => {
    if (!authenticated) return undefined;
    
    try {
      const { getSession } = await import('@/lib/auth');
      const session = await getSession();
      return session?.session?.access_token;
    } catch (error) {
      logger.error('Error getting auth token:', error);
      return undefined;
    }
  }, [authenticated]);

  return useQuery({
    queryKey: ['liked-tracks'],
    queryFn: async () => {
      if (!authenticated) {
        return [];
      }
      const token = await getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/tracks/liked', { headers });
      if (!response.ok) {
        if (response.status === 401) {
          return [];
        }
        throw new Error('Failed to fetch liked tracks');
      }

      const data = await response.json();
      
      // Edge case: Handle different response formats
      if (data && typeof data === 'object') {
        if ('data' in data && Array.isArray(data.data)) {
          return data.data;
        }
        if (Array.isArray(data)) {
          return data;
        }
      }
      
      return [];
    },
    enabled: authenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
