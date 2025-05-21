import { Timestamp } from 'firebase-admin/firestore';
import { StockChange, ChangeType } from '../types/stock';

class StockHistoryDTO {
  productId: string;
  changeType: ChangeType;
  quantity: number;
  timestamp: Date;
  note: string;

  constructor(
    productId: string,
    changeType: ChangeType,
    quantity: number,
    timestamp: Timestamp | Date,
    note: string
  ) {
    this.productId = productId;
    this.changeType = changeType;
    this.quantity = quantity;
    this.timestamp = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    this.note = note;
  }

  static fromStockChange(stockChange: StockChange): StockHistoryDTO {
    return new StockHistoryDTO(
      stockChange.productId,
      stockChange.changeType,
      stockChange.quantity,
      stockChange.timestamp,
      stockChange.note
    );
  }
}

export { StockHistoryDTO };
