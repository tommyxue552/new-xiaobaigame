import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/features/categories/api";
import { getGames } from "@/features/games/api";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { generatePageMetadata } from "@/lib/seo";
import { GameGrid } from "@/components/game/GameGrid";
import { GameCard } from "@/components/game/GameCard";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Category } from "@/types/category";
import type { GameListItem } from "@/types/game";

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  let category: Category | null = null;
  try {
    category = await getCategoryBySlug(params.slug);
  } catch {
    return { title: `Category Not Found | ${SITE_NAME}` };
  }

  return generatePageMetadata({
    title: `${category.name} Games`,
    description:
      category.description ||
      `Browse all ${category.name} games and resources. ${SITE_DESCRIPTION}`,
    canonical: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const pageSize = 12;

  let category: Category;
  try {
    category = await getCategoryBySlug(params.slug);
  } catch {
    notFound();
  }

  let games: GameListItem[] = [];
  let totalPages = 1;
  let total = 0;

  try {
    const result = await getGames({
      page,
      page_size: pageSize,
      category: params.slug,
      sort_by: "published_at",
      sort_order: "desc",
    });
    games = result.items;
    totalPages = result.total_pages;
    total = result.total;
  } catch {
    // games fetch failed, show empty
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Games`,
    description: category.description || `Browse all ${category.name} games.`,
    url: `/category/${category.slug}`,
    numberOfItems: total,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {category.description}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {total} game{total !== 1 ? "s" : ""} found
          </p>
        </div>

        {games.length === 0 ? (
          <EmptyState
            title="No games in this category"
            description="Check back later for new additions."
          />
        ) : (
          <>
            <GameGrid
              games={games}
              renderCard={(game) => <GameCard game={game} />}
            />
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
        )}
      </div>
    </>
  );
}
