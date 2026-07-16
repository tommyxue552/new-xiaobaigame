export interface DownloadProviderBrief {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
}

export interface DownloadResource {
  id: string;
  game_id: string;
  provider: DownloadProviderBrief;
  download_url: string;
  extract_code: string | null;
  priority: number;
  status: string;
  notes: string | null;
}

/** Response from GET /api/v1/games/{slug}/downloads */
export interface GameDownloadsResponse {
  game_id: string;
  game_title: string;
  game_slug: string;
  downloads: DownloadResource[];
}

/** Response from GET /api/v1/downloads/{id} */
export interface DownloadDetailResponse {
  id: string;
  game_id: string;
  game_title: string;
  game_slug: string;
  download_url: string;
  extract_code: string | null;
  provider: DownloadProviderBrief;
}
