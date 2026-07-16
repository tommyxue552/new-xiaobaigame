import Link from "next/link";
import { cn } from "@/lib/utils";
import { GameCard } from "@/components/game/GameCard";
import type { GameListItem } from "@/types/game";

interface RelatedGamesProps {
  games: GameListItem[];
  className?: string;
}

/** Related games section (same category). */
export function RelatedGames({ games, className }: RelatedGamesProps) {
  if (!games || games.length === 0) return null;

  return (
    <div className={cn("", className)}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Related Games
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
