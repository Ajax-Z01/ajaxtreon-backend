import { dbInstance, toTimestampRange } from './utils';
import { StockChange } from '../types/Stock';
import { StockHistoryDTO } from '../dtos/stockHistoryDTO';

const db = dbInstance;

export const getStockChangeHistory = async (startDate: string, endDate: string): Promise<StockHistoryDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const snapshot = await db.collection('stock_changes')
      .where('timestamp', '>=', startTimestamp)
      .where('timestamp', '<=', endTimestamp)
      .get();

    if (snapshot.empty) {
      console.log('No stock changes found in the given range');
      return [];
    }

    const changes: StockHistoryDTO[] = snapshot.docs.map(doc => {
      const data = doc.data() as StockChange;
      return StockHistoryDTO.fromStockChange(data);
    });

    return changes;
  } catch (error) {
    console.error('Error fetching stock change history:', error);
    throw new Error('Error fetching stock change history');
  }
};
