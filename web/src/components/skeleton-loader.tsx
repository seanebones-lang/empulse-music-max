/**
 * Skeleton loader components for better perceived performance
 */

export function TrackSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
        <div className="w-16 h-16 rounded-lg bg-gray-700/50 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-3/4" />
          <div className="h-3 bg-gray-700/30 rounded w-1/2" />
        </div>
        <div className="w-10 h-10 rounded bg-gray-700/50 shrink-0" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-48 h-48 rounded-lg bg-gray-700/50" />
    </div>
  );
}

export function ContentSectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-700/50 rounded w-64 animate-pulse" />
      <div className="flex gap-4 overflow-x-auto">
        {[...Array(5)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <TrackSkeleton key={i} />
      ))}
    </div>
  );
}
