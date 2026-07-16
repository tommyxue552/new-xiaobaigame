/** Admin-related type definitions. */

export interface AdminInfo {
  id: string;
  username: string;
  email: string;
  display_name: string | null;
  role: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  admin: AdminInfo;
}

export interface DashboardStats {
  games_count: number;
  categories_count: number;
  tags_count: number;
  downloads_count: number;
  recent_games: DashboardRecentGame[];
}

export interface DashboardRecentGame {
  id: string;
  title: string;
  slug: string;
  cover: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export interface AdminGameCreate {
  title: string;
  title_en?: string | null;
  slug?: string | null;
  summary?: string | null;
  content?: string | null;
  cover?: string | null;
  category_id?: string | null;
  published_at?: string | null;
  status?: string;
  seo_title?: string | null;
  seo_keywords?: string | null;
  seo_description?: string | null;
  tag_ids?: string[];
}

export interface AdminGameUpdate {
  title?: string;
  title_en?: string | null;
  slug?: string | null;
  summary?: string | null;
  content?: string | null;
  cover?: string | null;
  category_id?: string | null;
  published_at?: string | null;
  status?: string;
  seo_title?: string | null;
  seo_keywords?: string | null;
  seo_description?: string | null;
  tag_ids?: string[] | null;
}

export interface AdminCategoryCreate {
  name: string;
  slug?: string | null;
  description?: string | null;
  parent_id?: string | null;
  sort_order?: number;
}

export interface AdminCategoryUpdate {
  name?: string;
  slug?: string | null;
  description?: string | null;
  parent_id?: string | null;
  sort_order?: number;
}

export interface AdminTagCreate {
  name: string;
  slug?: string | null;
}

export interface AdminTagUpdate {
  name?: string;
  slug?: string | null;
}

export interface AdminDownloadCreate {
  game_id: string;
  provider_id: string;
  download_url: string;
  extract_code?: string | null;
  priority?: number;
  status?: string;
  notes?: string | null;
}

export interface AdminDownloadUpdate {
  game_id?: string;
  provider_id?: string;
  download_url?: string;
  extract_code?: string | null;
  priority?: number;
  status?: string;
  notes?: string | null;
}

export interface AdminProviderCreate {
  name: string;
  slug?: string | null;
  icon_url?: string | null;
  website_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface AdminProviderUpdate {
  name?: string;
  slug?: string | null;
  icon_url?: string | null;
  website_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}
