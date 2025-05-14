import { Timestamp } from 'firebase-admin/firestore';


export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  isDeleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
}

export interface OrderRequestBody {
  customerId: string;
  productId: string;
  quantity: number;
  status?: OrderStatus;
}

export interface StockChange {
  product_id: string;
  change_type: 'add' | 'subtract';
  quantity: number;
  timestamp: Timestamp;
  note: string;
}

export interface Payment {
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string | null;
  createdAt: Timestamp;
}
