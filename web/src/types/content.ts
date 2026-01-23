import { Track } from '@/store/player-store';

export type ContentType = 'genre' | 'feature' | 'artist' | 'playlist' | 'album' | 'track';

/**
 * Content card metadata
 * Extensible metadata object for different content types
 */
export interface ContentCardMetadata {
  trackCount?: number;
  duration?: number;
  priority?: string;
  status?: string;
  effort?: string;
  followers?: number;
  [key: string]: string | number | boolean | undefined;
}

export type ContentCard = {
  id: string;
  type: ContentType;
  title: string;
  subtitle?: string;
  image: string;
  description?: string;
  // For genres/features - contains nested content
  items?: ContentCard[];
  // For playlists/albums - contains tracks
  tracks?: Track[];
  // Metadata - properly typed
  metadata?: ContentCardMetadata;
};

export type Section = {
  id: string;
  title: string;
  type: 'feature' | 'genre' | 'custom';
  items: ContentCard[];
  showAllLink?: string;
};
