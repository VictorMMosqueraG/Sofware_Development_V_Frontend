export interface ExpenseHeader {
  egrId: number;
  sedeId: number;
  noEgreso: number;
  fechaDocumento: string;
  terceroIdentificacion: string;
  terceroNombre: string | null;
  detalle: string;
  fpId: number;
  conId: number;
  noDocumento: string;
  valorEgreso: number;
  usuId: number;
  egrEstado: 'ACTIVO' | 'ANULADO';
  createdAt?: string;
  updatedAt?: string;
}
