export interface UpdatePresentationRequest {
  presDescripcion?: string;
  presAbreviatura?: string;
  presEstado?: 'ACTIVO' | 'INACTIVO';
}
