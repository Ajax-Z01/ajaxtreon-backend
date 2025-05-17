import { Stock } from '../types/stock';

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

  static fromStock(stock: Stock): StockReportDTO {
    return new StockReportDTO(
      stock.productId,
      stock.productName,
      stock.currentStock,
      stock.updatedAt,
      stock.category
    );
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
