/** Generic offset-paginated response envelope used across admin list endpoints. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
