export interface CreatePaymentMethodRequest {
  fpDescripcion: string;
  fpEstado: 'ACTIVO' | 'INACTIVO';
}
