import { Timestamp } from 'firebase-admin/firestore';
import { ItemDetails, MidtransCustomerDetails } from './payment';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Cancelled = 'cancelled',
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

export interface OrderCalculationOptions {
  discount?: number;
  discountPercentage?: number;
  taxPercentage?: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  isDeleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp | null;

  items: OrderItem[];

  totalAmount: number;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  refundAmount?: number;
  paymentId?: string;
  createdBy?: string;
}

export interface OrderRequestBody {
  customerId: string;
  productId: string;
  quantity: number;
  status?: OrderStatus;
}

export interface OrderPayload {
  items: ItemDetails[];
  customerId: string;
  userId: string;
  createdBy: string;
  customer: MidtransCustomerDetails;
  paymentMethod?: string;
  discount?: number;
  tax?: number;
  refundAmount?: number;
  status?: OrderStatus;
}

export interface OrderResponse extends Omit<Order, 'createdAt' | 'updatedAt' | 'deletedAt'> {
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
