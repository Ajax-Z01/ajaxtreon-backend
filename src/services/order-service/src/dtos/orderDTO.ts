import { OrderStatus } from '../types/order';
import { DocumentSnapshot } from 'firebase-admin/firestore';

interface OrderItemDTO {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

class OrderDTO {
  id?: string;
  customerId: string;
  status: OrderStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  items: OrderItemDTO[];

  totalAmount: number;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  refundAmount?: number;
  paymentId?: string;
  createdBy?: string;

  constructor(
    customerId: string,
    items: OrderItemDTO[],
    totalAmount: number,
    status: OrderStatus = 'pending',
    isDeleted: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    deletedAt: Date | null = null,
    discount?: number,
    tax?: number,
    paymentMethod?: string,
    refundAmount?: number,
    paymentId?: string,
    createdBy?: string,
    id?: string
  ) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.status = status;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.discount = discount;
    this.tax = tax;
    this.paymentMethod = paymentMethod;
    this.refundAmount = refundAmount;
    this.paymentId = paymentId;
    this.createdBy = createdBy;
  }

  static validate(dto: OrderDTO): string[] {
    const errors: string[] = [];

    if (!dto.customerId || typeof dto.customerId !== 'string' || dto.customerId.trim() === '') {
      errors.push('Invalid or missing customerId');
    }

    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      errors.push('Items must be a non-empty array');
    } else {
      dto.items.forEach((item, index) => {
        if (!item.productId || typeof item.productId !== 'string' || item.productId.trim() === '') {
          errors.push(`Item ${index} has invalid or missing productId`);
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          errors.push(`Item ${index} quantity must be a positive number`);
        }
        if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
          errors.push(`Item ${index} unitPrice must be a non-negative number`);
        }
        if (item.discount !== undefined && (typeof item.discount !== 'number' || item.discount < 0)) {
          errors.push(`Item ${index} discount must be a non-negative number`);
        }
        if (item.tax !== undefined && (typeof item.tax !== 'number' || item.tax < 0)) {
          errors.push(`Item ${index} tax must be a non-negative number`);
        }
      });
    }

    if (typeof dto.totalAmount !== 'number' || dto.totalAmount < 0) {
      errors.push('totalAmount must be a non-negative number');
    }

    if (dto.discount !== undefined && (typeof dto.discount !== 'number' || dto.discount < 0)) {
      errors.push('discount must be a non-negative number');
    }

    if (dto.tax !== undefined && (typeof dto.tax !== 'number' || dto.tax < 0)) {
      errors.push('tax must be a non-negative number');
    }

    if (!['pending', 'completed', 'cancelled'].includes(dto.status)) {
      errors.push('Invalid status value');
    }

    if (!(dto.createdAt instanceof Date) || isNaN(dto.createdAt.getTime())) {
      errors.push('Invalid createdAt');
    }

    if (!(dto.updatedAt instanceof Date) || isNaN(dto.updatedAt.getTime())) {
      errors.push('Invalid updatedAt');
    }

    return errors;
  }

  static validateUpdate(status: string): boolean {
    return ['pending', 'completed', 'cancelled'].includes(status);
  }

  static transformToFirestore(dto: OrderDTO) {
    return {
      customerId: dto.customerId.trim(),
      status: dto.status,
      isDeleted: dto.isDeleted,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
      items: dto.items.map(item => ({
        productId: item.productId.trim(),
        productName: typeof item.productName === 'string' ? item.productName.trim() : undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: item.tax,
      })),
      totalAmount: dto.totalAmount,
      discount: dto.discount,
      tax: dto.tax,
      paymentMethod: dto.paymentMethod,
      refundAmount: dto.refundAmount,
      paymentId: dto.paymentId,
      createdBy: dto.createdBy,
    };
  }

  static transformFromFirestore(
    doc: DocumentSnapshot
  ): OrderDTO {
    const data = doc.data();

    return new OrderDTO(
      data?.customerId ?? '',
      (data?.items ?? []).map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: item.tax,
      })),
      data?.totalAmount ?? 0,
      data?.status ?? 'pending',
      data?.isDeleted ?? false,
      data?.createdAt?.toDate?.() ?? new Date(),
      data?.updatedAt?.toDate?.() ?? new Date(),
      data?.deletedAt?.toDate?.() ?? null,
      data?.discount,
      data?.tax,
      data?.paymentMethod,
      data?.refundAmount,
      data?.paymentId,
      data?.createdBy,
      doc.id
    );
  }
}

export default OrderDTO;
