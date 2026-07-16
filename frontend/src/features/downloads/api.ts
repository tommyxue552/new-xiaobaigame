import { apiFetch } from "@/lib/api";
import type { GameDownloadsResponse } from "@/types/download";

/**
 * Fetch download resources for a game (public endpoint).
 */
export async function getGameDownloads(slug: string): Promise<GameDownloadsResponse> {
  return apiFetch<GameDownloadsResponse>(`/games/${slug}/downloads`);
}
