import { apiFetch } from "@/lib/api";
import type { CategoryTreeNode, Category } from "@/types/category";

export async function getCategories(): Promise<CategoryTreeNode[]> {
  return apiFetch<CategoryTreeNode[]>("/categories");
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return apiFetch<Category>(`/categories/${slug}`);
}
