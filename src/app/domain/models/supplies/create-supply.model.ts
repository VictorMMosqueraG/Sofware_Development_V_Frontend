export interface CreateSupplyRequest {
  sedeId: number;
  cinsId: number;
  presId: number;
  insNombre: string;
  insCodigo?: string;
  insCodigoBarras?: string;
  insPrecioCompra?: number;
  insStock: number;
  insStockMin: number;
  insVendible: number;
  insImagen?: string;
  insEstado: number;
}
