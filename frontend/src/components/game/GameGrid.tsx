import { cn } from "@/lib/utils";
import type { GameListItem } from "@/types/game";

interface GameGridProps {
  games: GameListItem[];
  renderCard: (game: GameListItem) => React.ReactNode;
  className?: string;
}

/** Responsive grid layout for game cards. */
export function GameGrid({ games, renderCard, className }: GameGridProps) {
  if (games.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {games.map((game) => (
        <div key={game.id}>{renderCard(game)}</div>
      ))}
    </div>
  );
}
