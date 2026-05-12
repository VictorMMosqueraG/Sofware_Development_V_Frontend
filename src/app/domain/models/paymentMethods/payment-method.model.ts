export interface PaymentMethod {
  fpId: number;
  fpDescripcion: string;
  fpEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
