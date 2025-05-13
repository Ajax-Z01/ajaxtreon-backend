export interface PurchaseData {
  supplierId: string;
  productId: string;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  isDeleted?: boolean;
}

export type PurchaseStatus = 'pending' | 'completed' | 'cancelled';
