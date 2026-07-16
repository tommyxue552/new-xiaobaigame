export interface TagDetail {
  id: string;
  name: string;
  slug: string;
  game_count: number;
  created_at: string;
  updated_at: string;
}

export interface TagListResponse {
  items: TagDetail[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
