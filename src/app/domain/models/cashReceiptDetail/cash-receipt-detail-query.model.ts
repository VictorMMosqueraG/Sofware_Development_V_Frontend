export interface CashReceiptDetailSearchQuery {
  pagination: {
    page:     number;
    pageSize: number;
    sort:     string;
    order:    'asc' | 'desc';
  };
  rcNum?: number;
  plaId?: number;
}
