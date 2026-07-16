import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Reusable skeleton loading placeholder. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}
