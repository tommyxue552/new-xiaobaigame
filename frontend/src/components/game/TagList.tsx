import Link from "next/link";
import { cn } from "@/lib/utils";
import type { GameTag } from "@/types/game";

interface TagListProps {
  tags: GameTag[];
  className?: string;
}

/** Tag list with links to tag-filtered game list. */
export function TagList({ tags, className }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/?tag=${tag.slug}`}
          className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
