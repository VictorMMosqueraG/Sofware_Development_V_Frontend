export interface StatusSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  estEstado?: string;
  tesId?: number;
}
