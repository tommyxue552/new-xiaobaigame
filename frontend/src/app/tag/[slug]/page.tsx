import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug } from "@/features/tags/api";
import { getGames } from "@/features/games/api";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { generatePageMetadata } from "@/lib/seo";
import { GameGrid } from "@/components/game/GameGrid";
import { GameCard } from "@/components/game/GameCard";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import type { TagDetail } from "@/types/tag";
import type { GameListItem } from "@/types/game";

interface TagPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  let tag: TagDetail | null = null;
  try {
    tag = await getTagBySlug(params.slug);
  } catch {
    return { title: `Tag Not Found | ${SITE_NAME}` };
  }

  return generatePageMetadata({
    title: `${tag.name} Games`,
    description: `Browse ${tag.name} games and resources. ${SITE_DESCRIPTION}`,
    canonical: `/tag/${tag.slug}`,
  });
}

export default async function TagPage({
  params,
  searchParams,
}: TagPageProps) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const pageSize = 12;

  let tag: TagDetail;
  try {
    tag = await getTagBySlug(params.slug);
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
      tag: params.slug,
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
    name: `${tag.name} Games`,
    description: `Browse ${tag.name} games and resources.`,
    url: `/tag/${tag.slug}`,
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
            {tag.name}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {total} game{total !== 1 ? "s" : ""} found
          </p>
        </div>

        {games.length === 0 ? (
          <EmptyState
            title="No games with this tag"
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
