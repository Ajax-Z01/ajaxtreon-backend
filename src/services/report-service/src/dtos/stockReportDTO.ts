class StockReportDTO {
  productId: string;
  productName: string;
  currentStock: number;
  category?: string;
  lastUpdated: Date;

  constructor(
    productId: string,
    productName: string,
    currentStock: number,
    lastUpdated: Date,
    category?: string
  ) {
    this.productId = productId;
    this.productName = productName;
    this.currentStock = currentStock;
    this.lastUpdated = lastUpdated;
    this.category = category;
  }

  static fromFirestore(docData: any): StockReportDTO {
    return new StockReportDTO(
      docData.productId || '',
      docData.productName || '',
      docData.currentStock || 0,
      docData.updatedAt?.toDate?.() || new Date(),
      docData.category || undefined
    );
  }
}

export { StockReportDTO };
