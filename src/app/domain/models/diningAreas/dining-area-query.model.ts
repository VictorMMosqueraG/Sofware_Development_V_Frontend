export interface DiningAreaSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  areaEstado?: string;
  sedeId?: number;
}
