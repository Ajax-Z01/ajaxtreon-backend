import { Timestamp } from 'firebase-admin/firestore';

export type PurchaseStatus = 'pending' | 'completed' | 'cancelled';

export interface Purchase {
  supplierId: string;
  productId: string;
  quantity: number;
  status: PurchaseStatus;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp | null;
  deletedAt: Date | Timestamp | null;
  isDeleted?: boolean;
}
