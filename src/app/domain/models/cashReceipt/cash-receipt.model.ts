export interface CashReceipt {
  rcNum:         number;
  usuId:         number;
  rcFecha:       string;
  pedId:         number;
  cliId:         number;
  rcTotal:       number;
  rcObservacion: string;
  rcEstado:      'ACTIVO' | 'INACTIVO' | 'ANULADO';
}
