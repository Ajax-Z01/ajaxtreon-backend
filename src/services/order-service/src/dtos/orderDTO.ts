class OrderDTO {
  customerId: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    customerId: string,
    productId: string,
    quantity: number,
    status: 'pending' | 'completed' | 'cancelled',
    isDeleted: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.customerId = customerId;
    this.productId = productId;
    this.quantity = quantity;
    this.status = status || 'pending';  // Default to 'pending' if status not provided
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validate order data
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

    if (typeof data.isDeleted !== 'boolean') {
      errors.push('isDeleted must be a boolean');
    }

    if (!['pending', 'completed', 'cancelled'].includes(data.status)) {
      errors.push('Status must be one of: pending, completed, cancelled');
    }

    if (!(data.createdAt instanceof Date) || isNaN(data.createdAt.getTime())) {
      errors.push('Invalid or missing createdAt');
    }

    if (!(data.updatedAt instanceof Date) || isNaN(data.updatedAt.getTime())) {
      errors.push('Invalid or missing updatedAt');
    }

    return errors;
  }

  // Validate order update
  static validateUpdate(status: string): boolean {
    const validStatuses = ['pending', 'completed', 'cancelled'];
    return validStatuses.includes(status);
  }

  // Transform data to Firestore format
  static transformToFirestore(dto: OrderDTO) {
    return {
      customerId: dto.customerId.trim(),
      productId: dto.productId.trim(),
      quantity: dto.quantity,
      status: dto.status,
      isDeleted: dto.isDeleted,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  // Transform data from Firestore to DTO format
  static transformFromFirestore(doc: FirebaseFirestore.DocumentSnapshot): OrderDTO {
    const data = doc.data();
    return new OrderDTO(
      data?.customerId ?? '',
      data?.productId ?? '',
      data?.quantity ?? 0,
      data?.status ?? 'pending',
      data?.isDeleted ?? false,
      data?.createdAt.toDate() ?? new Date(),
      data?.updatedAt.toDate() ?? new Date()
    );
  }
}

export default OrderDTO;
