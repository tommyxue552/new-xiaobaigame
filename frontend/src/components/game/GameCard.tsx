import Link from "next/link";
import Image from "next/image";
import { Clock, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameListItem } from "@/types/game";

interface GameCardProps {
  game: GameListItem;
  className?: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** Single game card for grid display. */
export function GameCard({ game, className }: GameCardProps) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg",
        className
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {game.cover ? (
          <Image
            src={game.cover}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No cover</span>
          </div>
        )}
        {/* Category badge */}
        {game.category && (
          <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
            {game.category.name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {game.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(game.published_at)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="h-3 w-3" />
            {formatCount(game.download_count)}
          </span>
        </div>

        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
