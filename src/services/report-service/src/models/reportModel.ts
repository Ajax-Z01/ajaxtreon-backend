import admin from 'firebase-admin';
import { SalesReportDTO } from '../dtos/salesReportDTO';
import { PurchaseReportDTO } from '../dtos/purchaseReportDTO';
import { StockReportDTO } from '../dtos/stockReportDTO';
import { RevenueReportDTO } from '../dtos/revenueReportDTO';
import { CustomerReportDTO } from '../dtos/customerReportDTO';
import { SupplierReportDTO } from '../dtos/supplierReportDTO';
import { InventoryTurnoverDTO } from '../dtos/inventoryTurnoverDTO';
import { Order } from '../types/order';
import { Purchase } from '../types/purchase';
import { StockChange } from '../types/stock';
import { UserData } from '../types/user';

const db = admin.firestore();

const toTimestampRange = (startDate: string, endDate: string): { startTimestamp: admin.firestore.Timestamp; endTimestamp: admin.firestore.Timestamp } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return {
    startTimestamp: admin.firestore.Timestamp.fromDate(start),
    endTimestamp: admin.firestore.Timestamp.fromDate(end),
  };
};

const queryByDateRange = async <T>(
  collectionName: string,
  startTimestamp: admin.firestore.Timestamp,
  endTimestamp: admin.firestore.Timestamp,
  additionalFilters?: [string, FirebaseFirestore.WhereFilterOp, any][]
): Promise<T[]> => {
  let ref = db.collection(collectionName)
    .where('createdAt', '>=', startTimestamp)
    .where('createdAt', '<=', endTimestamp);

  if (additionalFilters) {
    additionalFilters.forEach(([field, op, value]) => {
      ref = ref.where(field, op, value);
    });
  }

  const snapshot = await ref.get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => doc.data() as T);
};


const getSalesData = async (startDate: string, endDate: string): Promise<SalesReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);
  try {
    const orders = await queryByDateRange<Order>('orders', startTimestamp, endTimestamp, [['isDeleted', '==', false]]);
    const salesData: SalesReportDTO[] = [];
    orders.forEach(order => {
      salesData.push(...SalesReportDTO.fromOrder(order));
    });
    return salesData;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Error fetching sales data');
  }
};

const getPurchaseData = async (startDate: string, endDate: string): Promise<PurchaseReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);
  try {
    const purchases = await queryByDateRange<Purchase>('purchases', startTimestamp, endTimestamp, [['isDeleted', '==', false]]);
    return purchases.map(p => PurchaseReportDTO.fromFirestore(p));
  } catch (error) {
    console.error('Error fetching purchase data:', error);
    throw new Error('Error fetching purchase data');
  }
};

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

const getStockReport = async (startDate: string, endDate: string): Promise<StockReportDTO[]> => {
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

const getStockChangeHistory = async (startDate: string, endDate: string): Promise<StockChange[]> => {
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

const getRevenueReport = async (startDate: string, endDate: string): Promise<RevenueReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const snapshot = await db.collection('orders')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp)
      .where('isDeleted', '==', false)
      .where('status', '==', 'completed')
      .get();

    if (snapshot.empty) {
      console.log('No matching completed orders found');
      return [];
    }

    const revenueReports: RevenueReportDTO[] = snapshot.docs
      .map(doc => RevenueReportDTO.fromOrder(doc.data() as Order))
      .filter(report => report !== null) as RevenueReportDTO[];

    return revenueReports;
  } catch (error) {
    console.error('Error fetching revenue report data:', error);
    throw new Error('Error fetching revenue report data');
  }
};

const getCustomerReport = async (startDate: string, endDate: string): Promise<CustomerReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const usersSnapshot = await db.collection('users')
      // .where('role', '==', 'customer')
      .where('isActive', '==', true)
      .get();

    if (usersSnapshot.empty) {
      console.log('No active customers found');
      return [];
    }

    const customers: UserData[] = usersSnapshot.docs.map(doc => {
      const data = doc.data() as UserData;
      const { id, ...rest } = data;
      return { id: doc.id, ...rest };
    });

    const ordersSnapshot = await db.collection('orders')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp)
      .where('isDeleted', '==', false)
      .get();

    const orders: Order[] = ordersSnapshot.docs.map(doc => doc.data() as Order);

    const reports = customers.map(customer => {
      const customerOrders = orders.filter(order => order.customerId === customer.id);
      return CustomerReportDTO.fromData(customer, customerOrders);
    });

    return reports;
  } catch (error) {
    console.error('Error fetching customer report:', error);
    throw new Error('Error fetching customer report');
  }
};

const getSupplierReport = async (startDate: string, endDate: string): Promise<SupplierReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const usersSnapshot = await db.collection('users')
      // .where('role', '==', 'supplier')
      .where('isActive', '==', true)
      .get();

    if (usersSnapshot.empty) {
      console.log('No active suppliers found');
      return [];
    }

    const suppliers: UserData[] = usersSnapshot.docs.map(doc => {
      const data = doc.data() as UserData;
      const { id, ...rest } = data;
      return { id: doc.id, ...rest };
    });

    const purchasesSnapshot = await db.collection('purchases')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp)
      .where('isDeleted', '==', false)
      .get();

    const purchases: Purchase[] = purchasesSnapshot.docs.map(doc => doc.data() as Purchase);

    const reports = suppliers.map(supplier => {
      const supplierPurchases = purchases.filter(purchase => purchase.supplierId === supplier.id);
      return SupplierReportDTO.fromData(supplier, supplierPurchases);
    });

    return reports;
  } catch (error) {
    console.error('Error fetching supplier report:', error);
    throw new Error('Error fetching supplier report');
  }
};

const getInventoryTurnoverReport = async (startDate: string, endDate: string): Promise<InventoryTurnoverDTO[]> => {
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

      const dto = new InventoryTurnoverDTO(
        productId,
        nameInfo.name,
        nameInfo.category,
        beginning,
        ending,
        sold
      );
      result.push(dto);
    });

    return result;
  } catch (error) {
    console.error('Error generating inventory turnover report:', error);
    throw new Error('Error generating inventory turnover report');
  }
};

export default {
  getSalesData,
  getPurchaseData,
  getStockReport,
  getStockChangeHistory,
  getRevenueReport,
  getCustomerReport,
  getSupplierReport,
  getInventoryTurnoverReport
};
