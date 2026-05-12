export interface DishIngredientSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  plaId?: number;
  insId?: number;
}
