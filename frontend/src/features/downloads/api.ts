import { apiFetch } from "@/lib/api";
import type { GameDownloadsResponse, DownloadDetailResponse } from "@/types/download";

/**
 * Fetch download resources for a game (public endpoint).
 */
export async function getGameDownloads(slug: string): Promise<GameDownloadsResponse> {
  return apiFetch<GameDownloadsResponse>(`/games/${slug}/downloads`);
}

/**
 * Fetch a single download resource by ID (for download jump page).
 */
export async function getDownloadById(id: string): Promise<DownloadDetailResponse> {
  return apiFetch<DownloadDetailResponse>(`/downloads/${id}`);
}
