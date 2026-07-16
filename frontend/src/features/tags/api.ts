import { apiFetch, buildQueryString } from "@/lib/api";
import type { TagDetail, TagListResponse } from "@/types/tag";

export async function getTags(params: {
  page?: number;
  page_size?: number;
  keyword?: string;
} = {}): Promise<TagListResponse> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | undefined>);
  return apiFetch<TagListResponse>(`/tags${qs}`);
}

export async function getTagBySlug(slug: string): Promise<TagDetail> {
  return apiFetch<TagDetail>(`/tags/${slug}`);
}
