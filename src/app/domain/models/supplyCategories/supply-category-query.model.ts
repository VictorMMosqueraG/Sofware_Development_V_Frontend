export interface SupplyCategorySearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  cinsEstado?: number;
}
