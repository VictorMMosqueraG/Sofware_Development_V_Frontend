export interface CreateCustomerRequest {
  cliNombre: string;
  cliApellidos: string;
  cliTipoDocumento: 'CC' | 'NIT' | 'CE' | 'Pasaporte';
  cliNumDocumento: string;
  cliDireccion?: string;
  cliTelefono?: string;
  cliCorreo?: string;
  cliEstado: 'ACTIVO' | 'INACTIVO';
}
