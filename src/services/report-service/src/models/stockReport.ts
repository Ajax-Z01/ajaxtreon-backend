import { dbInstance, toTimestampRange } from './utils';
import { StockReportDTO } from '../dtos/stockReportDTO';
import admin from 'firebase-admin';

const db = dbInstance;

const queryStockChanges = async (
  startTimestamp: admin.firestore.Timestamp,
  endTimestamp: admin.firestore.Timestamp
) => {
  const snapshot = await db.collection('stock_changes')
    .where('timestamp', '>=', startTimestamp)
    .where('timestamp', '<=', endTimestamp)
    .get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      productId: data.productId,
      changeType: data.changeType,
      quantity: data.quantity,
      timestamp: data.timestamp,
      note: data.note,
    };
  });
};

export const getStockReport = async (startDate: string, endDate: string): Promise<StockReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const changes = await queryStockChanges(startTimestamp, endTimestamp);

    const stockMap = new Map<string, { quantity: number; lastUpdated: Date }>();

    for (const change of changes) {
      const multiplier = change.changeType === 'add' ? 1 : -1;
      const current = stockMap.get(change.productId);
      const changeDate = change.timestamp.toDate ? change.timestamp.toDate() : change.timestamp;

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
    const productNameMap = new Map<string, string>();

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
