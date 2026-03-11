export interface UpdateCashReceiptRequest {
  usuId:         number;
  rcFecha:       string;
  pedId:         number;
  cliId:         number;
  rcTotal:       number;
  rcObservacion: string;
  rcEstado:      'ACTIVO' | 'INACTIVO' | 'ANULADO';
}
