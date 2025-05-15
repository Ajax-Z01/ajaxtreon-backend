import { Timestamp } from 'firebase-admin/firestore';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  isDeleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;

  items: {
    productId: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    tax?: number;
  }[];

  totalAmount: number;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  refundAmount?: number;
  paymentId?: string;
  createdBy?: string;
}