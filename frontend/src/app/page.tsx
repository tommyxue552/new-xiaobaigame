import type { Metadata } from "next";
import { getGames, getHotGames } from "@/features/games/api";
import { getCategories } from "@/features/categories/api";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { generateWebsiteJsonLd } from "@/lib/seo";
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
  description: SITE_DESCRIPTION,
  keywords: "game resources, game mods, game saves, game downloads, game tools, free game resources",
  openGraph: {
    title: `${SITE_NAME} - Game Resource Sharing`,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Game Resource Sharing`,
    description: SITE_DESCRIPTION,
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
}: {
  games: GameListItem[];
  page: number;
  totalPages: number;
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

  const websiteJsonLd = generateWebsiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="min-h-screen">
        <HeroBanner />

        <div className="py-10">
          <CategorySection categories={categories} />
        </div>

        <div className="py-10">
          <FeaturedGames
            latestGames={latestData.items}
            hotGames={hotData.items}
          />
        </div>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-foreground">All Games</h2>
          <PaginatedGameList
            games={latestData.items}
            page={latestData.page}
            totalPages={latestData.total_pages}
          />
        </section>
      </div>
    </>
  );
}
