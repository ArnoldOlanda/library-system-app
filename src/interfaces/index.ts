export interface ApiResponse<T> {
  data: T;
  status: string;
  timestamp: string;
}

export interface Pagination {
  limit: number;
  offset: number;
  pages: number;
  total: number;
}
