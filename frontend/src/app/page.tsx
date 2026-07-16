import type { Metadata } from "next";
import { getGames, getHotGames } from "@/features/games/api";
import { getCategories } from "@/features/categories/api";
import { SITE_NAME } from "@/lib/constants";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedGames } from "@/components/home/FeaturedGames";
import { GameGrid } from "@/components/game/GameGrid";
import { GameCard } from "@/components/game/GameCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import type { GameListItem } from "@/types/game";
import type { CategoryTreeNode } from "@/types/category";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Game Resource Sharing`,
  description:
    "Discover and share game resources — mods, saves, tools, and more. A community-driven platform for game resource sharing.",
  openGraph: {
    title: `${SITE_NAME} - Game Resource Sharing`,
    description:
      "Discover and share game resources — mods, saves, tools, and more.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

interface HomePageProps {
  searchParams: { page?: string; tab?: string; category?: string };
}

// Client-side pagination wrapper
function PaginatedGameList({
  games,
  page,
  totalPages,
  basePath,
}: {
  games: GameListItem[];
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (games.length === 0) {
    return (
      <EmptyState
        title="No games found"
        description="Games will appear here once they are published."
      />
    );
  }

  return (
    <>
      <GameGrid games={games} renderCard={(game) => <GameCard game={game} />} />
      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            // Client-side navigation via URL change
            const url = new URL(window.location.href);
            url.searchParams.set("page", String(newPage));
            window.location.href = url.toString();
          }}
        />
      </div>
    </>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const pageSize = 12;

  // Fetch data in parallel
  const [latestData, hotData, categories] = await Promise.all([
    getGames({
      page,
      page_size: pageSize,
      sort_by: "published_at",
      sort_order: "desc",
    }),
    getHotGames(12),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Section */}
      <div className="py-10">
        <CategorySection categories={categories} />
      </div>

      {/* Latest & Hot Games with tabs */}
      <div className="py-10">
        <FeaturedGames
          latestGames={latestData.items}
          hotGames={hotData.items}
        />
      </div>

      {/* Paginated game list */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-foreground">All Games</h2>
        <PaginatedGameList
          games={latestData.items}
          page={latestData.page}
          totalPages={latestData.total_pages}
          basePath="/"
        />
      </section>
    </div>
  );
}
