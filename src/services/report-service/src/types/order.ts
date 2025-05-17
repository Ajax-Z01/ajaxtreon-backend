import { Timestamp } from 'firebase-admin/firestore';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  isDeleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;

  items: OrderItem[];

  totalAmount: number;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  refundAmount?: number;
  paymentId?: string;
  createdBy?: string;
}