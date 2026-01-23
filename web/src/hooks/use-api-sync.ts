/**
 * Hook for syncing API data to Zustand store
 * Provides a pattern for API → Store → Components flow
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePlayer, type Track } from '@/store/player-store';
import { fetchTracks, fetchSections } from '@/lib/api';
import { logger } from '@/lib/logger';
import type { Section } from '@/types/content';

/**
 * Sync tracks from API to player store
 * 
 * @param options - Configuration options
 * @returns Query result with sync status
 */
export function useTracksSync(options?: {
  autoSync?: boolean;
  queryKey?: string[];
}) {
  const { setQueue } = usePlayer();
  const { autoSync = true, queryKey = ['tracks'] } = options || {};

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTracks<Track>(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-sync to store when data changes
  useEffect(() => {
    if (autoSync && query.data && query.data.length > 0) {
      setQueue(query.data);
      logger.info('Synced tracks to store:', query.data.length);
    }
  }, [query.data, autoSync, setQueue]);

  return query;
}

/**
 * Hook for syncing sections (doesn't sync to store, just provides data)
 * Sections are typically used for display only
 */
export function useSectionsSync() {
  return useQuery({
    queryKey: ['sections'],
    queryFn: () => fetchSections<Section>(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
