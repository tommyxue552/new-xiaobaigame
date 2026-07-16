import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagList } from "@/components/game/TagList";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import type { GameDetail } from "@/types/game";

interface GameHeaderProps {
  game: GameDetail;
  className?: string;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("zh-CN", {
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

/** Game header with cover, title, metadata, and breadcrumb. */
export function GameHeader({ game, className }: GameHeaderProps) {
  return (
    <div className={cn("", className)}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          ...(game.category
            ? [
                {
                  label: game.category.name,
                  href: `/?category=${game.category.slug}`,
                },
              ]
            : []),
          { label: game.title },
        ]}
        className="mb-4"
      />

      {/* Cover + Info */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Cover */}
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-60">
          {game.cover ? (
            <Image
              src={game.cover}
              alt={game.title}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">No cover</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {game.title}
            </h1>
            {game.title_en && (
              <p className="mt-1 text-sm text-muted-foreground">
                {game.title_en}
              </p>
            )}
            {game.summary && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {game.summary}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {game.published_at && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated: {formatDate(game.published_at)}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                Downloads: {formatCount(game.download_count)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                Views: {formatCount(game.view_count)}
              </span>
            </div>

            {/* Tags */}
            <TagList tags={game.tags} />
          </div>
        </div>
      </div>
    </div>
  );
}
