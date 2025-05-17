import { Timestamp } from 'firebase-admin/firestore';
export type ChangeType = 'add' | 'subtract';

export interface StockChange {
  productId: string;
  changeType: ChangeType;
  quantity: number;
  timestamp: Timestamp;
  note: string;
}

export interface Stock {
  productId: string;
  productName: string;
  currentStock: number;
  category?: string;
  updatedAt: Date;
}
