import { Timestamp, DocumentSnapshot } from 'firebase-admin/firestore';
import { Order, OrderItem, OrderStatus } from '../types/Order';

class OrderDTO {
  id?: string;
  customerId: string;
  status: OrderStatus;
  isDeleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
  items: OrderItem[];
  totalAmount: number;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  refundAmount?: number;
  paymentId?: string;
  createdBy?: string;

  constructor(order: Omit<Order, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
  }) {
    this.id = order.id;
    this.customerId = order.customerId;
    this.status = order.status;
    this.isDeleted = order.isDeleted ?? false;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.deletedAt = order.deletedAt;
    this.items = order.items;
    this.totalAmount = order.totalAmount;
    this.discount = order.discount;
    this.tax = order.tax;
    this.paymentMethod = order.paymentMethod;
    this.refundAmount = order.refundAmount;
    this.paymentId = order.paymentId;
    this.createdBy = order.createdBy;
  }

  static fromFirestore(doc: DocumentSnapshot): OrderDTO {
    const data = doc.data() ?? {};

    return new OrderDTO({
      id: doc.id,
      customerId: String(data.customerId ?? ''),
      status: Object.values(OrderStatus).includes(data.status) ? data.status : OrderStatus.Pending,
      isDeleted: Boolean(data.isDeleted),
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
      deletedAt: data.deletedAt ?? null,
      items: Array.isArray(data.items) ? data.items as OrderItem[] : [],
      totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
      discount: data.discount,
      tax: data.tax,
      paymentMethod: data.paymentMethod,
      refundAmount: data.refundAmount,
      paymentId: data.paymentId,
      createdBy: data.createdBy,
    });
  }

  static toFirestore(dto: OrderDTO): Order {
    return {
      id: dto.id ?? '',
      customerId: dto.customerId,
      status: dto.status,
      isDeleted: dto.isDeleted,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
      items: dto.items,
      totalAmount: dto.totalAmount,
      discount: dto.discount,
      tax: dto.tax,
      paymentMethod: dto.paymentMethod,
      refundAmount: dto.refundAmount,
      paymentId: dto.paymentId,
      createdBy: dto.createdBy,
    };
  }

  static validate(order: OrderDTO): string[] {
    const errors: string[] = [];

    if (!order.customerId || typeof order.customerId !== 'string') {
      errors.push('customerId is required and must be a string');
    }

    if (!Array.isArray(order.items) || order.items.length === 0) {
      errors.push('items must be a non-empty array');
    }

    if (typeof order.totalAmount !== 'number' || order.totalAmount < 0) {
      errors.push('totalAmount must be a positive number');
    }

    if (order.status && !this.validateUpdate(order.status)) {
      errors.push(`Invalid status: ${order.status}`);
    }

    return errors;
  }

  static validateUpdate(status: OrderStatus): boolean {
    return Object.values(OrderStatus).includes(status);
  }
}

export default OrderDTO;
