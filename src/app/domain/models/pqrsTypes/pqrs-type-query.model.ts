export interface PqrsTypeSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  tpqrsEstado?: string;
}
