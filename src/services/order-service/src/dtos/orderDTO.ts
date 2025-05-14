import { OrderStatus } from '../types/order';

class OrderDTO {
  customerId: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(
    customerId: string,
    productId: string,
    quantity: number,
    status: OrderStatus = 'pending',
    isDeleted: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    deletedAt: Date | null = null
  ) {
    this.customerId = customerId;
    this.productId = productId;
    this.quantity = quantity;
    this.status = status;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static validate(data: OrderDTO): string[] {
    const errors: string[] = [];

    if (!data.customerId || typeof data.customerId !== 'string' || data.customerId.trim() === '') {
      errors.push('Invalid or missing customerId');
    }

    if (!data.productId || typeof data.productId !== 'string' || data.productId.trim() === '') {
      errors.push('Invalid or missing productId');
    }

    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }

    if (!['pending', 'completed', 'cancelled'].includes(data.status)) {
      errors.push('Invalid status value');
    }

    if (!(data.createdAt instanceof Date) || isNaN(data.createdAt.getTime())) {
      errors.push('Invalid createdAt');
    }

    if (!(data.updatedAt instanceof Date) || isNaN(data.updatedAt.getTime())) {
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
      productId: dto.productId.trim(),
      quantity: dto.quantity,
      status: dto.status,
      isDeleted: dto.isDeleted,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deletedAt: dto.deletedAt,
    };
  }

  static transformFromFirestore(
    doc: FirebaseFirestore.DocumentSnapshot
  ): OrderDTO {
    const data = doc.data();

    return new OrderDTO(
      data?.customerId ?? '',
      data?.productId ?? '',
      data?.quantity ?? 0,
      data?.status ?? 'pending',
      data?.isDeleted ?? false,
      data?.createdAt?.toDate?.() ?? new Date(),
      data?.updatedAt?.toDate?.() ?? new Date(),
      data?.deletedAt?.toDate?.() ?? null
    );
  }
}

export default OrderDTO;
