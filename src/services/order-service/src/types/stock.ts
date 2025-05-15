import { Timestamp } from 'firebase-admin/firestore';

export type ChangeType = 'add' | 'subtract';

export interface StockChange {
  product_id: string;
  productName?: string;
  change_type: ChangeType;
  quantity: number;
  timestamp: Timestamp;
  note: string;
}