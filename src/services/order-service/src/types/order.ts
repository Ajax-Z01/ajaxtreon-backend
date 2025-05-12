import { firestore } from 'firebase-admin';``

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  isDeleted?: boolean;
  createdAt?: firestore.Timestamp;
  updatedAt?: firestore.Timestamp;
  deletedAt?: firestore.Timestamp;
}

export interface OrderRequestBody {
  customerId: string;
  productId: string;
  quantity: number;
  status?: string;
}

export interface StockChange {
  product_id: string;
  change_type: 'add' | 'subtract';
  quantity: number;
  timestamp: firestore.Timestamp;
  note: string;
}

export interface Payment {
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string | null;
  createdAt: firestore.Timestamp;
}
