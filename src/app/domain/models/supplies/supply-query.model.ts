export interface SupplySearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  insEstado?: number;
  sedeId?: number;
}
