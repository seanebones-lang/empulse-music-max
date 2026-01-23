/**
 * Types for user likes/favorites feature
 */

import type { Track } from '@/store/player-store';

/**
 * User like record
 */
export interface UserLike {
  id: string;
  user_id: string;
  track_id: string;
  created_at: string;
}

/**
 * Like status for a track
 */
export interface TrackLikeStatus {
  track_id: string;
  is_liked: boolean;
  like_id?: string;
}

/**
 * Like response from API
 */
export interface LikeResponse {
  success: boolean;
  is_liked: boolean;
  like_id?: string;
  message?: string;
}
