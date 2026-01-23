/**
 * Input validation schemas using Zod
 * 
 * Provides type-safe validation for API routes and forms.
 * All schemas use Zod for runtime validation with TypeScript type inference.
 * 
 * @module lib/validation
 */

import { z } from 'zod';

/**
 * Track validation schema
 * 
 * Validates track objects with required fields:
 * - id: Non-empty string
 * - title: 1-200 characters
 * - artist: 1-200 characters
 * - url: Valid URL format
 * - artwork: Optional valid URL
 * - duration: Positive integer
 * 
 * @example
 * ```ts
 * const result = trackSchema.safeParse(trackData);
 * if (result.success) {
 *   // result.data is typed as Track
 * }
 * ```
 */
export const trackSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  artist: z.string().min(1, 'Artist is required').max(200, 'Artist name too long'),
  url: z.string().url('Invalid URL format'),
  artwork: z.string().url('Invalid artwork URL').optional(),
  duration: z.number().int().positive('Duration must be positive'),
});

/**
 * Content card validation schema
 * 
 * Validates content card objects (tracks, playlists, artists, etc.)
 * 
 * @example
 * ```ts
 * const card = { id: '1', type: 'track', title: 'Song', image: 'https://...' };
 * const result = contentCardSchema.safeParse(card);
 * ```
 */
export const contentCardSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  type: z.enum(['track', 'playlist', 'artist', 'album', 'genre', 'feature', 'custom']),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  subtitle: z.string().max(300, 'Subtitle too long').optional(),
  image: z.string().url('Invalid image URL'),
  description: z.string().max(1000, 'Description too long').optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Section validation schema
 * 
 * Validates section objects containing arrays of content cards.
 * Used for validating API responses from /api/sections.
 * 
 * @example
 * ```ts
 * const section = { id: 'genres', title: 'Genres', type: 'genre', items: [...] };
 * const result = sectionSchema.safeParse(section);
 * ```
 */
export const sectionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  type: z.enum(['feature', 'genre', 'custom']),
  items: z.array(contentCardSchema),
  showAllLink: z.boolean().optional(),
});

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Sign in validation schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Sign up validation schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Password reset request schema
 */
export const resetPasswordRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset schema
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * API request validation helper
 * 
 * Validates data against a Zod schema and returns a typed result.
 * 
 * @template T - The type inferred from the schema
 * @param {z.ZodSchema<T>} schema - Zod schema to validate against
 * @param {unknown} data - Data to validate
 * @returns {Object} Validation result with success flag, typed data, or error message
 * 
 * @example
 * ```ts
 * const result = validateRequest(trackSchema, apiData);
 * if (result.success) {
 *   // result.data is typed as Track
 *   console.log(result.data.title);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        error: result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
    };
  }
}
