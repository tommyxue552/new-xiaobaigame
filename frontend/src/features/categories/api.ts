import { apiFetch } from "@/lib/api";
import type { CategoryTreeNode } from "@/types/category";

/**
 * Fetch the full category tree (public endpoint).
 */
export async function getCategories(): Promise<CategoryTreeNode[]> {
  return apiFetch<CategoryTreeNode[]>("/categories");
}
