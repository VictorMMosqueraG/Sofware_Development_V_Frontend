export interface Supply {
  insId: number;
  sedeId: number;
  cinsId: number;
  presId: number;
  insNombre: string;
  insCodigo: string | null;
  insCodigoBarras: string | null;
  insPrecioCompra: number | null;
  insStock: number;
  insStockMin: number;
  insVendible: number;
  insImagen: string | null;
  insEstado: number;
  createdAt?: string;
  updatedAt?: string;
}
