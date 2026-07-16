import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CategoryTreeNode } from "@/types/category";
import { Skeleton } from "@/components/shared/Skeleton";
import { FolderOpen } from "lucide-react";

interface CategorySectionProps {
  categories: CategoryTreeNode[];
  className?: string;
}

/** Category entry section from category tree data. */
export function CategorySection({
  categories,
  className,
}: CategorySectionProps) {
  // Flatten the tree to get top-level categories + their immediate children
  const entries = categories.slice(0, 8);

  return (
    <section className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Categories</h2>
        <Link
          href="/categories"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {entries.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <FolderOpen className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {cat.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {cat.game_count} games
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Skeleton loading for category section. */
export function CategorySectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-7 w-32" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
          >
            <Skeleton className="h-5 w-5 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
