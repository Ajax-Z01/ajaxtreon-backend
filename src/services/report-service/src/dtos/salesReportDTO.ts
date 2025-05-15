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

  static fromOrder(orderData: any): SalesReportDTO[] {
    const createdAt = orderData.createdAt?.toDate?.() ?? new Date();

    return orderData.items.map((item: any) => new SalesReportDTO(
      orderData.customerId,
      item.productId,
      item.quantity,
      createdAt
    ));
  }
}

export { SalesReportDTO };
