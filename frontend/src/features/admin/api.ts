/** Admin API functions. */
import { adminFetch } from "@/lib/admin-api";
import { buildQueryString } from "@/lib/api";
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  DashboardStats,
  AdminGameCreate,
  AdminGameUpdate,
  AdminCategoryCreate,
  AdminCategoryUpdate,
  AdminTagCreate,
  AdminTagUpdate,
  AdminDownloadCreate,
  AdminDownloadUpdate,
  AdminProviderCreate,
  AdminProviderUpdate,
} from "@/types/admin";
import type { PaginatedData } from "@/types";

// ---------------------------------------------------------------------------
// Inline types matching backend responses
// ---------------------------------------------------------------------------

interface GameListItem {
  id: string; title: string; title_en: string | null; slug: string;
  summary: string | null; cover: string | null;
  category: { id: string; name: string; slug: string } | null;
  published_at: string | null; view_count: number; download_count: number;
  status: string; tags: { id: string; name: string; slug: string }[];
  created_at: string;
}

interface GameDetail extends GameListItem {
  content: string | null; seo_title: string | null;
  seo_keywords: string | null; seo_description: string | null;
  screenshots: { id: string; image_url: string; title: string | null; sort_order: number }[];
  download_resources: unknown[];
  created_at: string; updated_at: string;
}

interface CategoryTreeNode {
  id: string; name: string; slug: string; description: string | null;
  parent_id: string | null; sort_order: number; game_count: number;
  children: CategoryTreeNode[];
}

interface TagItem {
  id: string; name: string; slug: string; game_count: number;
  created_at: string; updated_at: string;
}

interface DownloadItem {
  id: string; game_id: string;
  provider: { id: string; name: string; slug: string; icon_url: string | null };
  download_url: string; extract_code: string | null;
  priority: number; status: string; notes: string | null;
  created_at: string; updated_at: string;
}

interface ProviderItem {
  id: string; name: string; slug: string;
  icon_url: string | null; website_url: string | null;
  sort_order: number; is_active: boolean;
  created_at: string; updated_at: string;
}

// Auth
export async function adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
  return adminFetch<AdminLoginResponse>("/admin/auth/login", {
    method: "POST", body: JSON.stringify(data),
  });
}

// Dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  return adminFetch<DashboardStats>("/admin/dashboard");
}

// Games
export async function getAdminGames(params: Record<string, string | number | boolean | undefined> = {}): Promise<PaginatedData<GameListItem>> {
  const qs = buildQueryString(params);
  return adminFetch<PaginatedData<GameListItem>>(`/admin/games${qs}`);
}

export async function createGame(data: AdminGameCreate): Promise<GameDetail> {
  return adminFetch<GameDetail>("/admin/games", { method: "POST", body: JSON.stringify(data) });
}

export async function updateGame(id: string, data: AdminGameUpdate): Promise<GameDetail> {
  return adminFetch<GameDetail>(`/admin/games/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteGame(id: string): Promise<void> {
  return adminFetch<void>(`/admin/games/${id}`, { method: "DELETE" });
}

// Categories
export async function getAdminCategories(): Promise<CategoryTreeNode[]> {
  return adminFetch<CategoryTreeNode[]>("/categories");
}

export async function createCategory(data: AdminCategoryCreate): Promise<CategoryTreeNode> {
  return adminFetch<CategoryTreeNode>("/admin/categories", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCategory(id: string, data: AdminCategoryUpdate): Promise<CategoryTreeNode> {
  return adminFetch<CategoryTreeNode>(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteCategory(id: string): Promise<void> {
  return adminFetch<void>(`/admin/categories/${id}`, { method: "DELETE" });
}

// Tags
export async function getAdminTags(params: Record<string, string | number | boolean | undefined> = {}): Promise<PaginatedData<TagItem>> {
  const qs = buildQueryString(params);
  return adminFetch<PaginatedData<TagItem>>(`/tags${qs}`);
}

export async function createTag(data: AdminTagCreate): Promise<TagItem> {
  return adminFetch<TagItem>("/admin/tags", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTag(id: string, data: AdminTagUpdate): Promise<TagItem> {
  return adminFetch<TagItem>(`/admin/tags/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteTag(id: string): Promise<void> {
  return adminFetch<void>(`/admin/tags/${id}`, { method: "DELETE" });
}

// Downloads
export async function getAdminDownloads(params: Record<string, string | number | boolean | undefined> = {}): Promise<PaginatedData<DownloadItem>> {
  const qs = buildQueryString(params);
  return adminFetch<PaginatedData<DownloadItem>>(`/admin/downloads${qs}`);
}

export async function createDownload(data: AdminDownloadCreate): Promise<DownloadItem> {
  return adminFetch<DownloadItem>("/admin/downloads", { method: "POST", body: JSON.stringify(data) });
}

export async function updateDownload(id: string, data: AdminDownloadUpdate): Promise<DownloadItem> {
  return adminFetch<DownloadItem>(`/admin/downloads/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteDownload(id: string): Promise<void> {
  return adminFetch<void>(`/admin/downloads/${id}`, { method: "DELETE" });
}

// Providers
export async function getAdminProviders(): Promise<ProviderItem[]> {
  return adminFetch<ProviderItem[]>("/admin/download-providers");
}

export async function createProvider(data: AdminProviderCreate): Promise<ProviderItem> {
  return adminFetch<ProviderItem>("/admin/download-providers", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProvider(id: string, data: AdminProviderUpdate): Promise<ProviderItem> {
  return adminFetch<ProviderItem>(`/admin/download-providers/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProvider(id: string): Promise<void> {
  return adminFetch<void>(`/admin/download-providers/${id}`, { method: "DELETE" });
}

// Settings
export async function getSettings(): Promise<Record<string, string | null>> {
  return adminFetch<Record<string, string | null>>(`/admin/settings`);
}

export async function updateSettings(settings: Record<string, string | null>): Promise<Record<string, string | null>> {
  return adminFetch<Record<string, string | null>>(`/admin/settings`, {
    method: "PUT", body: JSON.stringify({ settings }),
  });
}
