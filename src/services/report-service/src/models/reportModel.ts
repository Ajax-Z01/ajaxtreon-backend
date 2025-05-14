import admin from 'firebase-admin';
import { SalesReportDTO } from '../dtos/salesReportDTO';
import { PurchaseReportDTO } from '../dtos/purchaseReportDTO';
import { Order } from '../types/order';
import { Purchase } from '../types/purchase';

const db = admin.firestore();

const getSalesData = async (startDate: string, endDate: string): Promise<any[]> => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);

  try {
    const snapshot = await db.collection('orders')
      .where('createdAt', '>=', startTimestamp)
      .where('createdAt', '<=', endTimestamp)
      .where('isDeleted', '==', false)
      .get();

    if (snapshot.empty) {
      console.log('No matching documents found');
      return [];
    }

    const orders: Order[] = snapshot.docs.map(doc => doc.data() as Order);
    return orders.map(order => SalesReportDTO.fromFirestore(order));
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

export default {
  getSalesData,
  getPurchaseData,
};
