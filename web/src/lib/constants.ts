/**
 * Application constants
 * Centralized location for magic numbers and configuration values
 */

// Volume controls
export const VOLUME_STEP = 0.1;
export const VOLUME_MIN = 0;
export const VOLUME_MAX = 1;
export const DEFAULT_VOLUME = 0.8;

// Timeouts and delays
export const ERROR_RETRY_DELAY = 1000; // ms
export const DEBOUNCE_DELAY = 300; // ms

// React Query configuration
export const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const QUERY_GC_TIME = 10 * 60 * 1000; // 10 minutes (formerly cacheTime)
export const QUERY_RETRY_COUNT = 2;

// Animation delays
export const CARD_ANIMATION_DELAY = 0.05; // seconds per card
export const SECTION_ANIMATION_DELAY = 0.1; // seconds per section

// Player configuration
export const POSITION_UPDATE_INTERVAL = 100; // ms (now using requestAnimationFrame)
export const CROSSFADE_DEFAULT = 2.0; // seconds

// Mood sliders
export const MOOD_MIN = 0;
export const MOOD_MAX = 100;
export const MOOD_DEFAULT = 50;

// Card sizes
export const STANDARD_CARD_SIZE = 'w-48 h-48';

// Sidebar configuration
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 400;
export const SIDEBAR_DEFAULT_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
