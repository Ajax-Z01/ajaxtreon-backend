import { Timestamp } from 'firebase-admin/firestore';
import { Purchase, PurchaseStatus } from '../types/purchase';

class PurchaseReportDTO {
  supplierId: string;
  productId: string;
  quantity: number;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  isDeleted?: boolean;

  constructor(
    supplierId: string,
    productId: string,
    quantity: number,
    status: PurchaseStatus,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    isDeleted?: boolean
  ) {
    this.supplierId = supplierId;
    this.productId = productId;
    this.quantity = quantity;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.isDeleted = isDeleted;
  }

  static fromFirestore(purchaseData: Purchase): PurchaseReportDTO {
    const toDateSafe = (value: Date | Timestamp | null | undefined): Date | null => {
      if (!value) return null;
      return value instanceof Timestamp ? value.toDate() : new Date(value);
    };

    return new PurchaseReportDTO(
      purchaseData.supplierId,
      purchaseData.productId,
      purchaseData.quantity,
      purchaseData.status,
      toDateSafe(purchaseData.createdAt)!,
      toDateSafe(purchaseData.updatedAt),
      toDateSafe(purchaseData.deletedAt),
      purchaseData.isDeleted
    );
  }
}

export { PurchaseReportDTO };
