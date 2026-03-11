export interface PaginatedResultDto<T> {
  results: T;
  total: number;
  page: number;
  pageSize: number;
  data: T;
  message: string;
  success: boolean;
}
