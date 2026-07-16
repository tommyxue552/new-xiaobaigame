"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GameCard } from "@/components/game/GameCard";
import { GameCardSkeleton } from "@/components/game/GameCardSkeleton";
import { GameGrid } from "@/components/game/GameGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import type { GameListItem } from "@/types/game";

interface FeaturedGamesProps {
  latestGames: GameListItem[];
  hotGames: GameListItem[];
  className?: string;
}

type Tab = "latest" | "hot";

/** Homepage featured games section with latest/hot tabs. */
export function FeaturedGames({
  latestGames,
  hotGames,
  className,
}: FeaturedGamesProps) {
  const [activeTab, setActiveTab] = useState<Tab>("latest");

  const games = activeTab === "latest" ? latestGames : hotGames;

  return (
    <section className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {/* Tab header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("latest")}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === "latest"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab("hot")}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === "hot"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Hot
          </button>
        </div>
      </div>

      {games.length > 0 ? (
        <GameGrid games={games} renderCard={(game) => <GameCard game={game} />} />
      ) : (
        <EmptyState
          title="No games yet"
          description="Games will appear here once they are published."
        />
      )}
    </section>
  );
}

/** Skeleton loading state for FeaturedGames. */
export function FeaturedGamesSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <div className="mb-6 flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
        <div className="rounded-md bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
          Latest
        </div>
        <div className="rounded-md px-4 py-1.5 text-sm text-muted-foreground">
          Hot
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
