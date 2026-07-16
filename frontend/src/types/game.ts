import type { PaginatedData } from "@/types";

/** Game tag reference */
export interface GameTag {
  id: string;
  name: string;
  slug: string;
}

/** Game category reference (nested in game list items) */
export interface GameCategoryBrief {
  id: string;
  name: string;
  slug: string;
}

/** Game list item (returned from GET /api/v1/games) */
export interface GameListItem {
  id: string;
  title: string;
  title_en: string | null;
  slug: string;
  summary: string | null;
  cover: string | null;
  category: GameCategoryBrief | null;
  published_at: string | null;
  view_count: number;
  download_count: number;
  status: string;
  tags: GameTag[];
}

/** Full game detail (returned from GET /api/v1/games/{slug}) */
export interface GameDetail extends GameListItem {
  content: string | null;
  seo_title: string | null;
  seo_keywords: string | null;
  seo_description: string | null;
  screenshots: GameScreenshot[];
  download_resources: GameDownloadResource[];
  created_at: string;
  updated_at: string;
}

export interface GameScreenshot {
  id: string;
  image_url: string;
  title: string | null;
  sort_order: number;
}

export interface GameDownloadResource {
  id: string;
  provider: {
    id: string;
    name: string;
    slug: string;
    icon_url: string | null;
  };
  download_url: string;
  extract_code: string | null;
  priority: number;
  status: string;
  notes: string | null;
}

/** Query parameters for GET /api/v1/games */
export interface GameListParams {
  page?: number;
  page_size?: number;
  category?: string;
  tag?: string;
  keyword?: string;
  sort_by?: "created_at" | "published_at" | "view_count" | "download_count" | "title";
  sort_order?: "asc" | "desc";
  status?: string;
}

/** Paginated game list response data */
export type GameListResponse = PaginatedData<GameListItem>;
