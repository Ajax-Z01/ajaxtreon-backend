class PurchaseDTO {
    constructor(supplierId, productId, quantity, status = 'pending') {
      this.supplierId = supplierId;
      this.productId = productId;
      this.quantity = quantity;
      this.status = status;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    // Validasi data purchase
    static validate(data) {
      return (
        typeof data.supplierId === 'string' &&
        data.supplierId.trim() !== '' &&
        typeof data.productId === 'string' &&
        data.productId.trim() !== '' &&
        typeof data.quantity === 'number' &&
        data.quantity > 0 &&
        typeof data.status === 'string' &&
        ['pending', 'completed', 'cancelled'].includes(data.status) &&
        data.createdAt instanceof Date &&
        !isNaN(data.createdAt) &&
        data.updatedAt instanceof Date &&
        !isNaN(data.updatedAt)
      );
    }
  
    // Transformasi untuk dikirim ke Firestore
    static transformToFirestore(data) {
      return {
        supplierId: data.supplierId.trim(),
        productId: data.productId.trim(),
        quantity: data.quantity,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
  
    // Transformasi dari Firestore ke DTO
    static transformFromFirestore(doc) {
      return new PurchaseDTO(
        doc.supplierId,
        doc.productId,
        doc.quantity,
        doc.status
      );
    }
  }
  
  module.exports = PurchaseDTO;
  