import admin from 'firebase-admin';
import { SalesReportDTO } from '../dtos/salesReportDTO';
import { PurchaseReportDTO } from '../dtos/purchaseReportDTO';
import { StockReportDTO } from '../dtos/stockReportDTO';
import { Order } from '../types/order';
import { Purchase } from '../types/purchase';
import { StockChange } from '../types/stock';

const db = admin.firestore();

const getSalesData = async (startDate: string, endDate: string): Promise<SalesReportDTO[]> => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);

  try {
    const snapshot = await db.collection('orders')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp)
      .where('isDeleted', '==', false)
      // .where('status', '==', 'completed')
      .get();

    if (snapshot.empty) {
      console.log('No matching documents found');
      return [];
    }

    const salesData: SalesReportDTO[] = [];

    snapshot.docs.forEach(doc => {
      const order = doc.data() as Order;
      const reports = SalesReportDTO.fromOrder(order);
      salesData.push(...reports);
    });

    return salesData;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Error fetching sales data');
  }
};

const getPurchaseData = async (startDate: string, endDate: string): Promise<any[]> => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);

  try {
    const snapshot = await db.collection('purchases')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp)
      .where('isDeleted', '==', false)
      .get();

    if (snapshot.empty) {
      console.log('No matching purchase documents found');
      return [];
    }

    const purchases: Purchase[] = snapshot.docs.map(doc => doc.data() as Purchase);
    return purchases.map(purchase => PurchaseReportDTO.fromFirestore(purchase));
  } catch (error) {
    console.error('Error fetching purchase data:', error);
    throw new Error('Error fetching purchase data');
  }
};

const getStockReport = async (startDate: string, endDate: string): Promise<any[]> => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);

  try {
    const snapshot = await db.collection('stock_changes')
      .where('timestamp', '>=', startTimestamp)
      .where('timestamp', '<=', endTimestamp)
      .get();

    if (snapshot.empty) {
      console.log('No matching stock change documents found');
      return [];
    }

    const changes: StockChange[] = snapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    }) as StockChange);

    const stockMap: Map<string, { quantity: number; lastUpdated: Date }> = new Map();

    for (const change of changes) {
      const multiplier = change.change_type === 'add' ? 1 : -1;
      const current = stockMap.get(change.product_id);

      if (current) {
        current.quantity += multiplier * change.quantity;
        if (change.timestamp > current.lastUpdated) {
          current.lastUpdated = change.timestamp;
        }
      } else {
        stockMap.set(change.product_id, {
          quantity: multiplier * change.quantity,
          lastUpdated: change.timestamp,
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

    const reports = productIds.map(productId => {
      const { quantity, lastUpdated } = stockMap.get(productId)!;
      const productName = productNameMap.get(productId) || '';
      return new StockReportDTO(productId, productName, quantity, lastUpdated);
    });

    return reports;
  } catch (error) {
    console.error('Error fetching stock report data:', error);
    throw new Error('Error fetching stock report data');
  }
};


export default {
  getSalesData,
  getPurchaseData,
  getStockReport
};
