import { ReciboCajaDetalle } from "./recibo-caja-detalle.model";

export interface ReciboCaja {
  id: number;
  numero: number;
  fecha: Date;
  cliente: string;
  total: number;
  estado: 'Activo' | 'Anulado';
  detalles: ReciboCajaDetalle[];
}
