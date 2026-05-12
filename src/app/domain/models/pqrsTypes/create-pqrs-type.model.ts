export interface CreatePqrsTypeRequest {
  tpqrsDescripcion: string;
  tpqrsEstado: 'ACTIVO' | 'INACTIVO';
}
