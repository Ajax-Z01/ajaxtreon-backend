import { Timestamp } from 'firebase-admin/firestore';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  createdAt: Timestamp;
  createdBy?: string;
}
