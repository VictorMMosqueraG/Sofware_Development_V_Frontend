export interface CreatePresentationRequest {
  presDescripcion: string;
  presAbreviatura: string;
  presEstado: 'ACTIVO' | 'INACTIVO';
}
