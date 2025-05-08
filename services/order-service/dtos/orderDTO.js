class OrderDTO {
    constructor(customerId, productId, quantity, status) {
      this.customerId = customerId;
      this.productId = productId;
      this.quantity = quantity;
      this.status = status;
      this.isDeleted = false;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    // Validate order data
    static validate(data) {
      if (
        typeof data.customerId === 'string' && data.customerId.trim() !== '' &&
        typeof data.productId === 'string' && data.productId.trim() !== '' &&
        typeof data.quantity === 'number' && data.quantity > 0 &&
        typeof data.isDeleted === 'boolean' && !data.isDeleted &&
        typeof data.status === 'string' && ['pending', 'completed', 'cancelled'].includes(data.status) &&
        typeof data.createdAt === 'object' && data.createdAt instanceof Date && !isNaN(data.createdAt) &&
        typeof data.updatedAt === 'object' && data.updatedAt instanceof Date && !isNaN(data.updatedAt)
      ) {
        return true;
      }
      return false;
    }
  
    // Transform data to Firestore format
    static transformToFirestore(data) {
      return {
        customerId: data.customerId.trim(),
        productId: data.productId.trim(),
        quantity: data.quantity,
        status: data.status,
        isDeleted: data.isDeleted,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    }
  
    // Transform data from Firestore to DTO format
    static transformFromFirestore(doc) {
      return new OrderDTO(doc.customerId, doc.productId, doc.quantity, doc.status, doc.isDeleted, doc.createdAt, doc.updatedAt);
    }
  }
  
  module.exports = OrderDTO;
  