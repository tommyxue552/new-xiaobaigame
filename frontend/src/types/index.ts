
/** Generic paginated response wrapper */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

﻿export * from "./game";
export * from "./category";
export * from "./download";
export * from "./admin";
