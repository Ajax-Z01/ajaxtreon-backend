import { toTimestampRange } from './utils';
import admin from 'firebase-admin';
import { CustomerReportDTO } from '../dtos/customerReportDTO';
import { UserData } from '../types/user';
import { Order } from '../types/order';

const db = admin.firestore();

export const getCustomerReport = async (startDate: string, endDate: string): Promise<CustomerReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const usersSnapshot = await db.collection('users')
      // .where('role', '==', 'customer') // Uncomment if needed
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
