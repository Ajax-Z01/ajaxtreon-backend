class PurchaseDTO {
  constructor(supplierId, productId, quantity, status = 'pending') {
    this.supplierId = supplierId;
    this.productId = productId;
    this.quantity = quantity;
    this.status = status;
    this.isDeleted = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static validate(data) {
    return (
      typeof data.supplierId === 'string' &&
      data.supplierId.trim() !== '' &&
      typeof data.productId === 'string' &&
      data.productId.trim() !== '' &&
      typeof data.quantity === 'number' &&
      data.quantity > 0 &&
      ['pending', 'completed', 'cancelled'].includes(data.status) &&
      data.createdAt instanceof Date &&
      !isNaN(data.createdAt) &&
      data.updatedAt instanceof Date &&
      !isNaN(data.updatedAt)
    );
  }

  static validateUpdate(data) {
    return (
      data &&
      typeof data.status === 'string' &&
      ['pending', 'completed', 'cancelled'].includes(data.status)
    );
  }

  static transformToFirestore(data) {
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
  
  static transformFromFirestore(doc, id) {
    return {
      id,
      supplierId: doc.supplierId,
      productId: doc.productId,
      quantity: doc.quantity,
      status: doc.status,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

module.exports = PurchaseDTO;
