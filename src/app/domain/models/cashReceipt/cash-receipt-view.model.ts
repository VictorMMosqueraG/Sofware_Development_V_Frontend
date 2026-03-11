import { CashReceipt } from './cash-receipt.model';

export interface CashReceiptView extends CashReceipt {
  clientName?: string;
  userName?: string;
}
