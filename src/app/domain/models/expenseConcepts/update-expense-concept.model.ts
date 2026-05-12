export interface UpdateExpenseConceptRequest {
  conDescripcion?: string;
  conEstado?: 'ACTIVO' | 'INACTIVO';
}
