export interface OrderDetailSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  pedId?: number;
  plaId?: number;
}
