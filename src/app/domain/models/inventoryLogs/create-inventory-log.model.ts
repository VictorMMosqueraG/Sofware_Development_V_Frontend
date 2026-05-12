export interface CreateInventoryLogRequest {
  insId: number;
  usuId: number;
  logTipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'VENTA' | 'MERMA';
  logCantidad: number;
  logStockAnt?: number;
  logStockNvo?: number;
  logNota?: string;
}
