export interface CashReceiptDetail {
  rcdId:        number;
  rcNum:        number;
  plaId:        number;
  rcdCantidad:  number;
  rcdPrecio:    number;
  rcdDescuento: number;
  createdAt?:   string;
  updatedAt?:   string;
}
