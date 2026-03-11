export interface CashReceiptSearchQuery {
  pagination: {
    page:     number;
    pageSize: number;
    sort:     string;
    order:    'asc' | 'desc';
  };
  rcEstado?: string;
  cliId?:    number;
  usuId?:    number;
}
