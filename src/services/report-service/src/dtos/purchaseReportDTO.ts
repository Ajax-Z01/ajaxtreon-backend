class PurchaseReportDTO {
  supplierId: string;
  productId: string;
  quantity: number;
  createdAt: Date;

  constructor(supplierId: string, productId: string, quantity: number, createdAt: Date) {
    this.supplierId = supplierId;
    this.productId = productId;
    this.quantity = quantity;
    this.createdAt = createdAt;
  }

  static fromFirestore(purchaseData: any): PurchaseReportDTO {
    return new PurchaseReportDTO(
      purchaseData.supplierId,
      purchaseData.productId,
      purchaseData.quantity,
      purchaseData.createdAt.toDate()
    );
  }
}

export { PurchaseReportDTO };
