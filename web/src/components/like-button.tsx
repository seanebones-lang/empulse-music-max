/**
 * Like button component for tracks
 * Handles like/unlike functionality with optimistic updates
 */

'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLikeTrack } from '@/hooks/use-like-track';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  trackId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showLabel?: boolean;
}

export function LikeButton({
  trackId,
  size = 'md',
  variant = 'ghost',
  className,
  showLabel = false,
}: LikeButtonProps) {
  // Early validation - return disabled button if trackId is invalid
  if (!trackId || typeof trackId !== 'string' || trackId.trim().length === 0) {
    return (
      <Button
        variant={variant}
        size={showLabel ? 'default' : 'icon'}
        disabled
        className={className}
        aria-label="Like track (unavailable)"
      >
        <Heart className="h-5 w-5 fill-none opacity-50" />
        {showLabel && <span className="ml-2">Like</span>}
      </Button>
    );
  }

  const { isLiked, isLoading, toggleLike } = useLikeTrack(trackId);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Button
      variant={variant}
      size={showLabel ? 'default' : 'icon'}
      onClick={(e) => {
        e.stopPropagation();
        toggleLike();
      }}
      disabled={isLoading}
      className={cn(
        showLabel ? '' : sizeClasses[size],
        'text-white hover:text-red-400 transition-colors',
        isLiked && 'text-red-400 hover:text-red-300',
        className
      )}
      aria-label={isLiked ? 'Unlike track' : 'Like track'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isLiked ? 'fill-current' : 'fill-none',
          'transition-all',
          isLoading && 'opacity-50'
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {isLiked ? 'Liked' : 'Like'}
        </span>
      )}
    </Button>
  );
}
