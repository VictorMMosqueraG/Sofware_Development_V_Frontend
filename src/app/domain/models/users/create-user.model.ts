export interface CreateUserRequest {
  usuNombre: string;
  usuApellido: string;
  usuDireccion: string;
  usuTelefono: string;
  usuCorreo: string;
  perfId?: number;
  usuLogin: string;
  usuPass: string;
  usuEstado: 'ACTIVO' | 'INACTIVO';
}
