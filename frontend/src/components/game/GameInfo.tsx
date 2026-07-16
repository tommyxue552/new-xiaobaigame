import { cn } from "@/lib/utils";
import type { GameDetail } from "@/types/game";

interface GameInfoProps {
  game: GameDetail;
  className?: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Game detailed information panel. */
export function GameInfo({ game, className }: GameInfoProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-foreground">
        Game Information
      </h2>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {game.category && (
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Category
            </dt>
            <dd className="mt-1 text-sm text-foreground">{game.category.name}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Published
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {game.published_at ? formatDate(game.published_at) : "-"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Last Updated
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatDate(game.updated_at)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Status
          </dt>
          <dd className="mt-1 text-sm text-foreground capitalize">
            {game.status}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Tags
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {game.tags.length > 0
              ? game.tags.map((t) => t.name).join(", ")
              : "None"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
