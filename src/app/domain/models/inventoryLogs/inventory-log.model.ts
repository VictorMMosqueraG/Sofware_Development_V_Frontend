export interface InventoryLog {
  logId: number;
  insId: number;
  usuId: number;
  logTipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'VENTA' | 'MERMA';
  logCantidad: number;
  logStockAnt: number | null;
  logStockNvo: number | null;
  logNota: string | null;
  createdAt?: string;
  updatedAt?: string;
}
