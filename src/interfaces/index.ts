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

export interface TableProps<T,U>{
  isLoading: boolean;
  data?: T;
  onEdit: (item: U) => void;
  onView?: (item: U) => void;
  onDelete: (item: U) => void;
  search?: string;
  onSearchChange: (search?: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export type RefreshTokenResponse = ApiResponse<{ token: string }>;
