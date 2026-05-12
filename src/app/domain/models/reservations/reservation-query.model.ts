export interface ReservationSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  resEstado?: string;
  sedeId?: number;
}
