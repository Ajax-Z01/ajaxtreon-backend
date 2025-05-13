export interface PaymentData {
  id?: string;
  orderId: string;
  amount: number;
  method: string | null;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
