/** The standard JSON envelope every backend endpoint returns */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  error: { code: string; details: unknown } | null;
}

/** Convenience alias kept for backward compatibility */
export type ApiResponse<T> = ApiEnvelope<T>;

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
