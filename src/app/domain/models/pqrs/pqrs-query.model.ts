export interface PqrsSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  estId?: number;
  tpqrsId?: number;
}
