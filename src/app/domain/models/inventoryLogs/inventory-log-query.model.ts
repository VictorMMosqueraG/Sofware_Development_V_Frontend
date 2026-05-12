export interface InventoryLogSearchQuery {
  pagination: {
    page: number;
    pageSize: number;
    sort: string;
    order: 'asc' | 'desc';
  };
  logTipo?: string;
  insId?: number;
}
