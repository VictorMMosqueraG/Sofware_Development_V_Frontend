export interface OrderSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  estId?: number;
  sedeId?: number;
}
