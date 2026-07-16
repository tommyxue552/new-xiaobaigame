import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SEOPageData {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  noIndex?: boolean;
}

export interface GameSEOData {
  title: string;
  titleEn?: string | null;
  summary?: string | null;
  cover?: string | null;
  slug: string;
  seoTitle?: string | null;
  seoKeywords?: string | null;
  seoDescription?: string | null;
}

// ---------------------------------------------------------------------------
// Metadata generators
// ---------------------------------------------------------------------------

/** Generate Next.js Metadata for a generic page. */
export function generatePageMetadata(data: SEOPageData): Metadata {
  const title = data.title.includes(SITE_NAME)
    ? data.title
    : `${data.title} | ${SITE_NAME}`;

  return {
    title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title,
      description: data.description,
      type: data.ogType ?? "website",
      images: data.ogImage ? [{ url: data.ogImage }] : undefined,
      siteName: SITE_NAME,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.description,
      images: data.ogImage ? [data.ogImage] : undefined,
    },
    alternates: {
      canonical: data.canonical,
    },
    robots: data.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Generate Next.js Metadata for a game detail page. */
export function generateGameMetadata(game: GameSEOData): Metadata {
  const title = game.seoTitle || `${game.title} | ${SITE_NAME}`;
  const description =
    game.seoDescription || game.summary || `${game.title} game detail page.`;

  return {
    title,
    description,
    keywords: game.seoKeywords || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      images: game.cover ? [{ url: game.cover, width: 1200, height: 630 }] : undefined,
      siteName: SITE_NAME,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: game.cover ? [game.cover] : undefined,
    },
    alternates: {
      canonical: `/game/${game.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD generators
// ---------------------------------------------------------------------------

export interface GameJsonLdData {
  title: string;
  titleEn?: string | null;
  summary?: string | null;
  cover?: string | null;
  slug: string;
  category?: { name: string; slug: string } | null;
  publishedAt?: string | null;
  downloadCount: number;
  viewCount: number;
}

/** Generate JSON-LD structured data for a VideoGame. */
export function generateGameJsonLd(game: GameJsonLdData): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    ...(game.titleEn ? { alternateName: game.titleEn } : {}),
    description: game.summary || "",
    image: game.cover || undefined,
    url: `${SITE_URL}/game/${game.slug}`,
    ...(game.category ? { genre: [game.category.name] } : {}),
    datePublished: game.publishedAt || undefined,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/DownloadAction",
        userInteractionCount: game.downloadCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ViewAction",
        userInteractionCount: game.viewCount,
      },
    ],
  };
}

/** Generate JSON-LD structured data for a WebSite (home page). */
export function generateWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Discover and share game resources ? mods, saves, tools, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?keyword={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Generate JSON-LD structured data for BreadcrumbList. */
export function generateBreadcrumbJsonLd(
  items: { name: string; url?: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
