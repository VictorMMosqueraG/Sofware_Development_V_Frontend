export interface CreateExpenseConceptRequest {
  conDescripcion: string;
  conEstado: 'ACTIVO' | 'INACTIVO';
}
