export interface DiningTableSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  estado?: string;
  sedeId?: number;
}
