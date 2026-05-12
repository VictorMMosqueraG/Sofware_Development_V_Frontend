export interface ExpenseHeaderSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  egrEstado?: string;
  sedeId?: number;
}
