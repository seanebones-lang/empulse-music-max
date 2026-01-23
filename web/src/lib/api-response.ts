/**
 * API Response utilities – standardized response format (DRY)
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Create a successful API response
 */
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string | Error,
  status = 500,
  message?: string
): NextResponse<ApiResponse<never>> {
  const errorMessage = error instanceof Error ? error.message : error;
  
  logger.error('API Error:', errorMessage);
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      message: message || errorMessage,
    },
    { status }
  );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
  errors: string | string[],
  status = 400
): NextResponse<ApiResponse<never>> {
  const errorMessage = Array.isArray(errors) ? errors.join(', ') : errors;
  
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      message: errorMessage,
    },
    { status }
  );
}

/**
 * Handle API route errors consistently
 */
export function handleApiError(error: unknown, context = 'API route'): NextResponse<ApiResponse<never>> {
  if (error instanceof Error) {
    logger.error(`${context} error:`, error);
    return errorResponse(error, 500);
  }
  
  logger.error(`${context} unknown error:`, error);
  return errorResponse('An unexpected error occurred', 500);
}
