export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled' | 'expired' | 'challenge';

export interface PaymentData {
  id?: string;
  orderId: string;
  amount: number;
  method: string | null;
  status: PaymentStatus;
  transactionTime?: Date | null;
  transactionId?: string | null;
  fraudStatus?: 'accept' | 'deny' | 'challenge' | null;
  paymentType?: string | null;
  vaNumber?: string | null;
  pdfUrl?: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface TransactionDetails {
  order_id: string;
  gross_amount: number;
}

export interface CustomerDetails {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export interface ItemDetails {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface CreateTransactionPayload {
  transaction_details: TransactionDetails;
  customer_details?: CustomerDetails;
  item_details?: ItemDetails[];
}
