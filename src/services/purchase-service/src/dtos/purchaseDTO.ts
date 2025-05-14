import { Timestamp } from 'firebase-admin/firestore';
import { PurchaseData, PurchaseStatus } from '../types/purchase';

class PurchaseDTO {
  supplierId: string;
  productId: string;
  quantity: number;
  status: PurchaseStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;

  constructor(
    supplierId: string,
    productId: string,
    quantity: number,
    status: PurchaseStatus = 'pending'
  ) {
    this.supplierId = supplierId;
    this.productId = productId;
    this.quantity = quantity;
    this.status = status;
    this.isDeleted = false;
    this.createdAt = new Date();
    this.updatedAt = null;
    this.deletedAt = null;
  }

  static validate(data: PurchaseData): boolean {
    const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());
    return (
      typeof data.supplierId === 'string' &&
      data.supplierId.trim() !== '' &&
      typeof data.productId === 'string' &&
      data.productId.trim() !== '' &&
      typeof data.quantity === 'number' &&
      data.quantity > 0 &&
      ['pending', 'completed', 'cancelled'].includes(data.status) &&
      isValidDate(data.createdAt) &&
      (data.updatedAt === null || isValidDate(data.updatedAt)) &&
      (data.deletedAt === null || isValidDate(data.deletedAt))
    );
  }

  static validateUpdate(data: { status: PurchaseStatus }): boolean {
    return (
      data &&
      ['pending', 'completed', 'cancelled'].includes(data.status)
    );
  }

  static transformToFirestore(data: PurchaseDTO): Omit<PurchaseData, 'supplierId' | 'productId' | 'quantity'> & {
    supplierId: string;
    productId: string;
    quantity: number;
  } {
    return {
      supplierId: data.supplierId.trim(),
      productId: data.productId.trim(),
      quantity: data.quantity,
      status: data.status,
      isDeleted: data.isDeleted,
      createdAt: Timestamp.fromDate(data.createdAt),
      updatedAt: data.updatedAt ? Timestamp.fromDate(data.updatedAt) : null,
      deletedAt: data.deletedAt ? Timestamp.fromDate(data.deletedAt) : null,
    };
  }

  static transformFromFirestore(
    doc: FirebaseFirestore.DocumentData,
    id: string
  ): PurchaseData & { id: string } {
    return {
      id,
      supplierId: doc.supplierId,
      productId: doc.productId,
      quantity: doc.quantity,
      status: doc.status,
      isDeleted: doc.isDeleted ?? false,
      createdAt: doc.createdAt?.toDate?.() ?? new Date(),
      updatedAt: doc.updatedAt?.toDate?.() ?? null,
      deletedAt: doc.deletedAt?.toDate?.() ?? null,
    };
  }
}

export default PurchaseDTO;
