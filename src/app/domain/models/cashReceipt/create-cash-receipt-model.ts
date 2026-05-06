export interface CreateCashReceiptRequest {
  sedeId:        number;
  usuId:         number;
  rcFecha:       string;
  pedId:         number;
  cliId:         number | null;
  fpId:          number;
  rcSubtotal:    number;
  rcDescuento:   number;
  rcPropina:     number;
  rcTotal:       number;
  rcMontoRec:    number | null;
  rcCambio:      number;
  rcObservacion: string | null;
  rcEstado:      'ACTIVO' | 'ANULADO';
}
