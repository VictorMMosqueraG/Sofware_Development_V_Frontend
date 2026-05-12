export interface UpdateUserRequest {
  usuNombre?: string;
  usuApellido?: string;
  usuDireccion?: string;
  usuTelefono?: string;
  usuCorreo?: string;
  perfId?: number;
  usuEstado?: 'ACTIVO' | 'INACTIVO';
}
