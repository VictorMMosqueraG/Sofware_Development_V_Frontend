export interface ExpenseConcept {
  conId: number;
  conDescripcion: string;
  conEstado: 'ACTIVO' | 'INACTIVO';
  createdAt?: string;
  updatedAt?: string;
}
