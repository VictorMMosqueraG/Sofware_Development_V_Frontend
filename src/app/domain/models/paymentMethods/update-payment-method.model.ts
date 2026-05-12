export interface UpdatePaymentMethodRequest {
  fpDescripcion?: string;
  fpEstado?: 'ACTIVO' | 'INACTIVO';
}
