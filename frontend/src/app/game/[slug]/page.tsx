import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug } from "@/features/games/api";
import { getGameDownloads } from "@/features/downloads/api";
import { getGames } from "@/features/games/api";
import { SITE_NAME } from "@/lib/constants";
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

/** Generate dynamic metadata for SEO. */
export async function generateMetadata({
  params,
}: GameDetailPageProps): Promise<Metadata> {
  let game: GameDetail | null = null;
  try {
    game = await getGameBySlug(params.slug);
  } catch {
    return { title: `Game Not Found | ${SITE_NAME}` };
  }

  const title = game.seo_title || `${game.title} | ${SITE_NAME}`;
  const description = game.seo_description || game.summary || `${game.title} game detail page.`;
  const keywords = game.seo_keywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      images: game.cover ? [{ url: game.cover }] : undefined,
    },
    alternates: { canonical: `/game/${game.slug}` },
  };
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
      relatedGames = relatedResult.items.filter((g: GameListItem) => g.id !== game.id);
    }
  } catch {
    downloadsData = {
      game_id: game.id,
      game_title: game.title,
      game_slug: game.slug,
      downloads: [],
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    ...(game.title_en ? { alternateName: game.title_en } : {}),
    description: game.summary || "",
    image: game.cover || undefined,
    ...(game.category ? { genre: [game.category.name] } : {}),
    datePublished: game.published_at || undefined,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: game.download_count,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: game.view_count,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
