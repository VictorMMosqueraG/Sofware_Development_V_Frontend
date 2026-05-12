export interface UpdateSupplyRequest {
  sedeId?: number;
  cinsId?: number;
  presId?: number;
  insNombre?: string;
  insCodigo?: string;
  insCodigoBarras?: string;
  insPrecioCompra?: number;
  insStock?: number;
  insStockMin?: number;
  insVendible?: number;
  insImagen?: string;
  insEstado?: number;
}
