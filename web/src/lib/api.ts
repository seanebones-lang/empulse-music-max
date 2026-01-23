/**
 * API utilities – generic fetch with error handling (DRY)
 */

import { logger } from './logger';
import type { ApiResponse } from './api-response';

/**
 * Generic API fetch with standardized response handling
 */
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Failed to fetch ${url}`);
  }
  
  const jsonData = await res.json();
  
  // Handle standardized API response format
  if (typeof jsonData === 'object' && jsonData !== null && 'success' in jsonData) {
    const apiResponse = jsonData as ApiResponse<T>;
    
    if (apiResponse.success && apiResponse.data !== undefined) {
      return apiResponse.data;
    }
    
    if (!apiResponse.success && apiResponse.error) {
      throw new Error(apiResponse.error);
    }
  }
  
  // Fallback: assume direct data response (backward compatibility)
  // Type guard to ensure T[] is returned for array responses
  if (Array.isArray(jsonData)) {
    return jsonData as T;
  }
  
  // For non-array responses, validate structure
  if (typeof jsonData === 'object' && jsonData !== null) {
    return jsonData as T;
  }
  
  throw new Error(`Invalid response format from ${url}`);
}

/**
 * Fetch tracks from API. Returns [] on error.
 */
export async function fetchTracks<T>(): Promise<T[]> {
  try {
    const data = await fetchApi<T[]>('/api/tracks');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    logger.error('Error fetching tracks', err);
    return [];
  }
}

/**
 * Fetch sections from API. Returns [] on error.
 */
export async function fetchSections<T>(): Promise<T[]> {
  try {
    const data = await fetchApi<T[]>('/api/sections');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    logger.error('Error fetching sections', err);
    return [];
  }
}

/**
 * Fetch liked tracks from API. Returns [] on error.
 */
export async function fetchLikedTracks<T>(authToken?: string): Promise<T[]> {
  try {
    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const data = await fetchApi<T[]>('/api/tracks/liked', { headers });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    logger.error('Error fetching liked tracks', err);
    return [];
  }
}
