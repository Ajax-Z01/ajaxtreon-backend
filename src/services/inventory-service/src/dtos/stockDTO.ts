import type { ChangeType } from '../types/stock';

export class StockChangeDTO {
  productId: string;
  changeType: ChangeType;
  quantity: number;
  timestamp: Date;
  note: string;

  constructor(
    productId: string,
    changeType: ChangeType,
    quantity: number,
    timestamp: Date,
    note: string
  ) {
    this.productId = productId;
    this.changeType = changeType;
    this.quantity = quantity;
    this.timestamp = timestamp;
    this.note = note;
  }

  static fromFirestore(docData: any): StockChangeDTO {
    return new StockChangeDTO(
      docData.productId,
      docData.changeType,
      docData.quantity,
      docData.timestamp?.toDate?.() ?? new Date(),
      docData.note
    );
  }
}

export class StockDTO {
  productId: string;
  productName: string;
  currentStock: number;
  category?: string;
  updatedAt: Date;

  constructor(
    productId: string,
    productName: string,
    currentStock: number,
    updatedAt: Date,
    category?: string
  ) {
    this.productId = productId;
    this.productName = productName;
    this.currentStock = currentStock;
    this.updatedAt = updatedAt;
    this.category = category;
  }

  static fromStockChanges(
    productId: string,
    productName: string,
    category: string | undefined,
    stockChanges: StockChangeDTO[]
  ): StockDTO {
    const currentStock = stockChanges.reduce((total, change) => {
      if (change.changeType === 'add') return total + change.quantity;
      if (change.changeType === 'subtract') return total - change.quantity;
      return total;
    }, 0);

    const updatedAt = stockChanges.reduce((latest, change) => {
      return change.timestamp > latest ? change.timestamp : latest;
    }, new Date(0));

    return new StockDTO(
      productId,
      productName,
      currentStock,
      updatedAt,
      category
    );
  }
}

export default StockDTO;
