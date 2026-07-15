/** Standard API response envelope */
export interface APIResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

/** Paginated response data */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/** Common query parameters for list endpoints */
export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
