import { dbInstance, toTimestampRange } from './utils';
import { StockReportDTO } from '../dtos/stockReportDTO';
import { StockChange } from '../types/stock';
import admin from 'firebase-admin';

const db = dbInstance;

const queryStockChanges = async (
  startTimestamp: admin.firestore.Timestamp,
  endTimestamp: admin.firestore.Timestamp
): Promise<StockChange[]> => {
  const snapshot = await db.collection('stock_changes')
    .where('timestamp', '>=', startTimestamp)
    .where('timestamp', '<=', endTimestamp)
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as StockChange),
    timestamp: doc.data().timestamp.toDate ? doc.data().timestamp.toDate() : doc.data().timestamp,
  }));
};

export const getStockReport = async (startDate: string, endDate: string): Promise<StockReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const changes = await queryStockChanges(startTimestamp, endTimestamp);

    const stockMap = new Map<string, { quantity: number; lastUpdated: Date }>();

    for (const change of changes) {
      const multiplier = change.changeType === 'add' ? 1 : -1;
      const current = stockMap.get(change.productId);
      const changeDate = change.timestamp instanceof Date ? change.timestamp : change.timestamp.toDate();

      if (current) {
        current.quantity += multiplier * change.quantity;
        if (changeDate > current.lastUpdated) {
          current.lastUpdated = changeDate;
        }
      } else {
        stockMap.set(change.productId, {
          quantity: multiplier * change.quantity,
          lastUpdated: changeDate,
        });
      }
    }

    const productIds = Array.from(stockMap.keys());
    const productNameMap: Map<string, string> = new Map();

    const productFetches = productIds.map(async (id) => {
      const doc = await db.collection('products').doc(id).get();
      if (doc.exists) {
        const data = doc.data();
        if (data?.name) {
          productNameMap.set(id, data.name);
        }
      }
    });

    await Promise.all(productFetches);

    return productIds.map(productId => {
      const { quantity, lastUpdated } = stockMap.get(productId)!;
      return new StockReportDTO(productId, productNameMap.get(productId) || '', quantity, lastUpdated);
    });
  } catch (error) {
    console.error('Error fetching stock report data:', error);
    throw new Error('Error fetching stock report data');
  }
};

export const getStockChangeHistory = async (startDate: string, endDate: string): Promise<StockChange[]> => {
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

    const changes: StockChange[] = snapshot.docs.map(doc => {
      const data = doc.data() as StockChange;
      return {
        id: doc.id,
        ...data,
      };
    });

    return changes;
  } catch (error) {
    console.error('Error fetching stock change history:', error);
    throw new Error('Error fetching stock change history');
  }
};