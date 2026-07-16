/** Recursive category tree node (returned from GET /api/v1/categories) */
export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  game_count: number;
  children: CategoryTreeNode[];
}

/** Flat category item */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  game_count: number;
  created_at: string;
  updated_at: string;
}
