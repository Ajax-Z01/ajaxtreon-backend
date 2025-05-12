class PaymentDTO {
  constructor(data) {
    this.orderId = data.orderId;
    this.amount = data.amount;
    this.status = data.status || 'pending';
    this.method = data.method || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || null;
  }

  static validate(data) {
    const errors = [];

    if (!data.orderId || typeof data.orderId !== 'string') {
      errors.push('Invalid or missing orderId');
    }

    if (typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('Amount must be a positive number');
    }

    const validStatuses = ['pending', 'paid', 'failed'];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (data.method && typeof data.method !== 'string') {
      errors.push('Payment method must be a string if provided');
    }

    return errors;
  }

  static validateUpdate(status) {
    const validStatuses = ['pending', 'paid', 'failed'];
    return validStatuses.includes(status);
  }

  static transformToFirestore(dto) {
    return {
      orderId: dto.orderId,
      amount: dto.amount,
      status: dto.status,
      method: dto.method,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static transformFromFirestore(data, id) {
    return {
      id,
      orderId: data.orderId,
      amount: data.amount,
      status: data.status,
      method: data.method,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    };
  }
}

module.exports = PaymentDTO;
