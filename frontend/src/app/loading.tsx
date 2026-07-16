import { FeaturedGamesSkeleton } from "@/components/home/FeaturedGames";
import { CategorySectionSkeleton } from "@/components/home/CategorySection";
import { Skeleton } from "@/components/shared/Skeleton";

/** Full-page loading skeleton for the homepage. */
export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-slate-900 px-4 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full bg-slate-700" />
          <Skeleton className="h-10 w-64 bg-slate-700" />
          <Skeleton className="h-6 w-96 bg-slate-700" />
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-10 w-32 rounded-md bg-slate-700" />
            <Skeleton className="h-10 w-32 rounded-md bg-slate-700" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="py-10">
        <CategorySectionSkeleton />
      </div>

      {/* Featured games skeleton */}
      <div className="py-10">
        <FeaturedGamesSkeleton />
      </div>
    </div>
  );
}
