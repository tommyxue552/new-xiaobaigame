import { Skeleton } from "@/components/shared/Skeleton";

/** Skeleton placeholder matching GameCard shape. */
export function GameCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Cover skeleton */}
      <div className="aspect-[16/10]">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Info skeleton */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
