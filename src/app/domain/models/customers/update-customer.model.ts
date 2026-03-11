export interface UpdateCustomerRequest {
  cliNombre?:        string;
  cliApellidos?:     string;
  cliTipoDocumento?: 'CC' | 'NIT' | 'CE' | 'Pasaporte';
  cliDireccion?:     string;
  cliTelefono?:      string;
  cliEstado?:        'ACTIVO' | 'INACTIVO';
}
