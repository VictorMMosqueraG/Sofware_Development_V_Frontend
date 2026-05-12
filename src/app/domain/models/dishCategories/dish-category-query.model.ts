export interface DishCategorySearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  catEstado?: string;
}
