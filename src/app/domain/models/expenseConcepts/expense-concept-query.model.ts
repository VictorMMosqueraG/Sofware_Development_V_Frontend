export interface ExpenseConceptSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  conEstado?: string;
}
