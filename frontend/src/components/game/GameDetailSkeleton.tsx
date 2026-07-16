import { Skeleton } from "@/components/shared/Skeleton";

/** Loading skeleton for the game detail page. */
export function GameDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header skeleton */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <Skeleton className="aspect-[3/4] w-full rounded-lg sm:w-60" />
        <div className="flex flex-1 flex-col justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>

      {/* Content separator */}
      <Skeleton className="mt-8 h-px w-full" />

      {/* Gallery skeleton */}
      <div className="mt-8">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <Skeleton className="aspect-video rounded-lg" />
          <Skeleton className="aspect-video rounded-lg" />
          <Skeleton className="aspect-video rounded-lg" />
          <Skeleton className="aspect-video rounded-lg" />
        </div>
      </div>

      {/* Download section skeleton */}
      <div className="mt-10">
        <Skeleton className="mb-4 h-6 w-28" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>

      {/* Related games skeleton */}
      <div className="mt-10">
        <Skeleton className="mb-4 h-6 w-36" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border">
              <Skeleton className="aspect-[16/10] w-full rounded-t-lg" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
