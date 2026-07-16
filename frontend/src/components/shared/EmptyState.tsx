import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

/** Empty data placeholder. */
export function EmptyState({
  title = "No data available",
  description = "Check back later for new content.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      <PackageOpen className="h-16 w-16 text-muted-foreground/40" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
