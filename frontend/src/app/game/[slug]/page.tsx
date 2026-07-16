import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug } from "@/features/games/api";
import { getGameDownloads } from "@/features/downloads/api";
import { getGames } from "@/features/games/api";
import { SITE_NAME } from "@/lib/constants";
import { generateGameMetadata, generateGameJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";
import { GameHeader } from "@/components/game/GameHeader";
import { GameInfo } from "@/components/game/GameInfo";
import { GameGallery } from "@/components/game/GameGallery";
import { DownloadSection } from "@/components/game/DownloadSection";
import { RelatedGames } from "@/components/game/RelatedGames";
import type { GameDetail } from "@/types/game";
import type { GameDownloadsResponse } from "@/types/download";
import type { GameListItem } from "@/types/game";

interface GameDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: GameDetailPageProps): Promise<Metadata> {
  let game: GameDetail | null = null;
  try {
    game = await getGameBySlug(params.slug);
  } catch {
    return { title: `Game Not Found | ${SITE_NAME}` };
  }

  return generateGameMetadata({
    title: game.title,
    titleEn: game.title_en,
    summary: game.summary,
    cover: game.cover,
    slug: game.slug,
    seoTitle: game.seo_title,
    seoKeywords: game.seo_keywords,
    seoDescription: game.seo_description,
  });
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  let game: GameDetail;
  let downloadsData: GameDownloadsResponse;
  let relatedGames: GameListItem[] = [];

  try {
    game = await getGameBySlug(params.slug);
  } catch {
    notFound();
  }

  try {
    const [downloadsResult, relatedResult] = await Promise.all([
      getGameDownloads(params.slug).catch(() => null),
      game.category
        ? getGames({
            category: game.category.slug,
            page_size: 8,
            sort_by: "published_at",
            sort_order: "desc",
            page: 1,
          }).catch(() => null)
        : Promise.resolve(null),
    ]);

    downloadsData = downloadsResult ?? {
      game_id: game.id,
      game_title: game.title,
      game_slug: game.slug,
      downloads: [],
    };

    if (relatedResult) {
      relatedGames = relatedResult.items.filter(
        (g: GameListItem) => g.id !== game.id
      );
    }
  } catch {
    downloadsData = {
      game_id: game.id,
      game_title: game.title,
      game_slug: game.slug,
      downloads: [],
    };
  }

  const gameJsonLd = generateGameJsonLd({
    title: game.title,
    titleEn: game.title_en,
    summary: game.summary,
    cover: game.cover,
    slug: game.slug,
    category: game.category
      ? { name: game.category.name, slug: game.category.slug }
      : null,
    publishedAt: game.published_at,
    downloadCount: game.download_count,
    viewCount: game.view_count,
  });

  const breadcrumbItems = [];
  if (game.category) {
    breadcrumbItems.push({
      name: game.category.name,
      url: `/category/${game.category.slug}`,
    });
  }
  breadcrumbItems.push({ name: game.title });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <GameHeader game={game} />
        <hr className="my-8 border-border" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <GameGallery screenshots={game.screenshots} />
            {game.content && (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Description
                </h2>
                <div
                  className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: game.content }}
                />
              </div>
            )}
          </div>
          <div className="space-y-10">
            <GameInfo game={game} />
          </div>
        </div>
        <div className="mt-10">
          <DownloadSection downloads={downloadsData.downloads} />
        </div>
        <div className="mt-12">
          <RelatedGames games={relatedGames} />
        </div>
      </div>
    </>
  );
}
