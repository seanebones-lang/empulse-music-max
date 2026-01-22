import { Track } from '@/store/player-store';

export type ContentType = 'genre' | 'feature' | 'artist' | 'playlist' | 'album' | 'track';

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
  // Metadata
  metadata?: {
    trackCount?: number;
    duration?: number;
    [key: string]: any;
  };
};

export type Section = {
  id: string;
  title: string;
  type: 'feature' | 'genre' | 'custom';
  items: ContentCard[];
  showAllLink?: string;
};
