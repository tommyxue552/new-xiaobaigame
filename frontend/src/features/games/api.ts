import { apiFetch, buildQueryString } from "@/lib/api";
import type { GameListParams, GameListResponse, GameDetail } from "@/types/game";

/**
 * Fetch paginated game list (public endpoint).
 */
export async function getGames(
  params: GameListParams = {}
): Promise<GameListResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined>);
  return apiFetch<GameListResponse>(`/games${qs}`);
}

/**
 * Fetch hot games sorted by download count.
 */
export async function getHotGames(
  pageSize: number = 12
): Promise<GameListResponse> {
  return getGames({
    page: 1,
    page_size: pageSize,
    sort_by: "download_count",
    sort_order: "desc",
  });
}

/**
 * Fetch single game detail by slug.
 */
export async function getGameBySlug(slug: string): Promise<GameDetail> {
  return apiFetch<GameDetail>(`/games/${slug}`);
}
