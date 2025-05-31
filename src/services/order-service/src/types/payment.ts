export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled' | 'expired' | 'challenge';

export interface PaymentData {
  id?: string;
  orderId: string;
  amount: number;
  method: string | null;
  status: PaymentStatus;
  note?: string | null;
  transactionTime?: Date | null;
  transactionId?: string | null;
  fraudStatus?: 'accept' | 'deny' | 'challenge' | null;
  paymentType?: string | null;
  vaNumber?: string | null;
  pdfUrl?: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  paidAt?: Date | null;
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

export interface MidtransTransactionResponse {
  transaction_id: string;
  order_id: string;
  payment_type: string;
  transaction_time: string;
  gross_amount: number;
  va_numbers?: { bank: string; va_number: string }[];
  fraud_status?: string;
  pdf_url?: string;
  redirect_url?: string;
}

export interface MidtransCustomerDetails {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  billing_address?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country_code?: string;
  };
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country_code?: string;
  };
}
