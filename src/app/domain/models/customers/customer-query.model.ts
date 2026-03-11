export interface CustomerSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  cliEstado?: string;
  cliTipoDocumento?: string;
  cliNumDocumento?: string;
}
