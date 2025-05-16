import { Timestamp } from 'firebase-admin/firestore';
import { PurchaseData, PurchaseStatus } from '../types/purchase';

class PurchaseDTO {
  id?: string;
  supplierId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: PurchaseStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  createdBy?: string;
  approvedBy?: string;
  invoiceNo?: string;
  notes?: string;

  constructor(
    supplierId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    status: PurchaseStatus = 'pending',
    createdBy?: string,
    approvedBy?: string,
    invoiceNo?: string,
    notes?: string
  ) {
    this.supplierId = supplierId;
    this.productId = productId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.totalPrice = quantity * unitPrice;
    this.status = status;
    this.isDeleted = false;
    this.createdAt = new Date();
    this.updatedAt = null;
    this.deletedAt = null;
    this.createdBy = createdBy;
    this.approvedBy = approvedBy;
    this.invoiceNo = invoiceNo;
    this.notes = notes;
  }

  static validate(data: Partial<PurchaseData> | PurchaseDTO): boolean {
    const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

    return (
      typeof data.supplierId === 'string' &&
      data.supplierId.trim() !== '' &&
      typeof data.productId === 'string' &&
      data.productId.trim() !== '' &&
      typeof data.quantity === 'number' &&
      data.quantity > 0 &&
      typeof data.unitPrice === 'number' &&
      data.unitPrice > 0 &&
      typeof data.status === 'string' &&
      ['pending', 'completed', 'cancelled'].includes(data.status) &&
      isValidDate(data.createdAt) &&
      (data.updatedAt === null || isValidDate(data.updatedAt)) &&
      (data.deletedAt === null || isValidDate(data.deletedAt))
    );
  }


  static validateUpdate(data: Partial<PurchaseData>): boolean {
    return (
      data &&
      typeof data.status === 'string' &&
      ['pending', 'completed', 'cancelled'].includes(data.status)
    );
  }

  static transformToFirestore(data: PurchaseDTO): Omit<PurchaseData, 'id'> {
    return {
      supplierId: data.supplierId.trim(),
      productId: data.productId.trim(),
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      totalPrice: data.totalPrice,
      status: data.status,
      isDeleted: data.isDeleted,
      createdAt: Timestamp.fromDate(data.createdAt),
      updatedAt: data.updatedAt ? Timestamp.fromDate(data.updatedAt) : null,
      deletedAt: data.deletedAt ? Timestamp.fromDate(data.deletedAt) : null,
      createdBy: data.createdBy,
      approvedBy: data.approvedBy,
      invoiceNo: data.invoiceNo,
      notes: data.notes,
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
      unitPrice: doc.unitPrice,
      totalPrice: doc.totalPrice ?? doc.unitPrice * doc.quantity,
      status: doc.status,
      isDeleted: doc.isDeleted ?? false,
      createdAt: doc.createdAt?.toDate?.() ?? new Date(),
      updatedAt: doc.updatedAt?.toDate?.() ?? null,
      deletedAt: doc.deletedAt?.toDate?.() ?? null,
      createdBy: doc.createdBy,
      approvedBy: doc.approvedBy,
      invoiceNo: doc.invoiceNo,
      notes: doc.notes,
    };
  }
}

export default PurchaseDTO;
