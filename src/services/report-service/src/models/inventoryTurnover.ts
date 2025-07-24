import { toTimestampRange, queryByDateRange, dbInstance } from './utils';
import { InventoryTurnoverDTO } from '../dtos/inventoryTurnoverDTO';
import { Order } from '../types/Order';
import { StockChange } from '../types/Stock';

const db = dbInstance;

export const getInventoryTurnoverReport = async (startDate: string, endDate: string): Promise<InventoryTurnoverDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const orders = await queryByDateRange<Order>('orders', startTimestamp, endTimestamp, [['isDeleted', '==', false]]);

    const soldMap = new Map<string, number>();
    for (const order of orders) {
      for (const item of order.items) {
        const prevQty = soldMap.get(item.productId) || 0;
        soldMap.set(item.productId, prevQty + item.quantity);
      }
    }

    const beginningSnapshot = await db.collection('stock_changes')
      .where('timestamp', '<', startTimestamp)
      .get();

    const beginningInventoryMap = new Map<string, number>();
    beginningSnapshot.forEach(doc => {
      const data = doc.data() as StockChange;
      const multiplier = data.changeType === 'add' ? 1 : -1;
      const prevQty = beginningInventoryMap.get(data.productId) || 0;
      beginningInventoryMap.set(data.productId, prevQty + multiplier * data.quantity);
    });

    const endingSnapshot = await db.collection('stock_changes')
      .where('timestamp', '<=', endTimestamp)
      .get();

    const endingInventoryMap = new Map<string, number>();
    endingSnapshot.forEach(doc => {
      const data = doc.data() as StockChange;
      const multiplier = data.changeType === 'add' ? 1 : -1;
      const prevQty = endingInventoryMap.get(data.productId) || 0;
      endingInventoryMap.set(data.productId, prevQty + multiplier * data.quantity);
    });

    const productIds = new Set<string>([
      ...soldMap.keys(),
      ...beginningInventoryMap.keys(),
      ...endingInventoryMap.keys()
    ]);

    const productNameMap = new Map<string, { name: string; category?: string }>();
    const productFetches = Array.from(productIds).map(async id => {
      const doc = await db.collection('products').doc(id).get();
      if (doc.exists) {
        const data = doc.data();
        productNameMap.set(id, { name: data?.name || '', category: data?.category });
      }
    });
    await Promise.all(productFetches);

    const result: InventoryTurnoverDTO[] = [];
    productIds.forEach(productId => {
      const nameInfo = productNameMap.get(productId) || { name: '', category: undefined };
      const sold = soldMap.get(productId) || 0;
      const beginning = beginningInventoryMap.get(productId) || 0;
      const ending = endingInventoryMap.get(productId) || 0;

      result.push(new InventoryTurnoverDTO(
        productId,
        nameInfo.name,
        nameInfo.category,
        beginning,
        ending,
        sold
      ));
    });

    return result;
  } catch (error) {
    console.error('Error generating inventory turnover report:', error);
    throw new Error('Error generating inventory turnover report');
  }
};
