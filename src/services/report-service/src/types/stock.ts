export type ChangeType = 'add' | 'subtract';

export interface StockChange {
  product_id: string;
  change_type: ChangeType;
  quantity: number;
  timestamp: Date;
  note: string;
}