class SalesReportDTO {
  customerId: string;
  productId: string;
  quantity: number;
  createdAt: Date;

  constructor(customerId: string, productId: string, quantity: number, createdAt: Date) {
    this.customerId = customerId;
    this.productId = productId;
    this.quantity = quantity;
    this.createdAt = createdAt;
  }

  static fromFirestore(orderData: any): SalesReportDTO {
    return new SalesReportDTO(
      orderData.customerId,
      orderData.productId,
      orderData.quantity,
      orderData.createdAt.toDate()
    );
  }
}

export { SalesReportDTO };
