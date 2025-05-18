import { toTimestampRange } from './utils';
import admin from 'firebase-admin';
import { RevenueReportDTO } from '../dtos/revenueReportDTO';
import { Order } from '../types/order';

const db = admin.firestore();

export const getRevenueReport = async (startDate: string, endDate: string): Promise<RevenueReportDTO[]> => {
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
