import { Timestamp } from 'firebase-admin/firestore';

export type PurchaseStatus = 'pending' | 'completed' | 'cancelled';

export interface PurchaseData {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  status: PurchaseStatus;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp | null;
  deletedAt: Date | Timestamp | null;
  isDeleted?: boolean;
  createdBy?: string;
  approvedBy?: string;
  invoiceNo?: string;
  notes?: string;
}
