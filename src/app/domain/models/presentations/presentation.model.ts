export interface Presentation {
  presId: number;
  presDescripcion: string;
  presAbreviatura: string;
  presEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
