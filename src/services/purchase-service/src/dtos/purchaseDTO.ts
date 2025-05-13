import { PurchaseData, PurchaseStatus } from '../types/purchase';

class PurchaseDTO {
  supplierId: string;
  productId: string;
  quantity: number;
  status: PurchaseStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

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
    this.updatedAt = new Date();
  }

  static validate(data: PurchaseData): boolean {
    return (
      typeof data.supplierId === 'string' &&
      data.supplierId.trim() !== '' &&
      typeof data.productId === 'string' &&
      data.productId.trim() !== '' &&
      typeof data.quantity === 'number' &&
      data.quantity > 0 &&
      ['pending', 'completed', 'cancelled'].includes(data.status) &&
      data.createdAt instanceof Date &&
      !isNaN(data.createdAt.getTime()) &&
      data.updatedAt instanceof Date &&
      !isNaN(data.updatedAt.getTime())
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
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
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
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(),
    };
  }
}

export default PurchaseDTO;
