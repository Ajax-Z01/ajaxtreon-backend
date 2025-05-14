import { Timestamp } from 'firebase-admin/firestore';

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  isDeleted?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
}