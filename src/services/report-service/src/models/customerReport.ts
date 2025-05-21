import { toTimestampRange } from './utils';
import admin from 'firebase-admin';
import { CustomerReportDTO } from '../dtos/customerReportDTO';
import { Customer } from '../types/customer';
import { Order } from '../types/order';

const db = admin.firestore();

export const getCustomerReport = async (startDate: string, endDate: string): Promise<CustomerReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    // Ambil semua data customer
    const customerSnapshot = await db.collection('customers').get();

    if (customerSnapshot.empty) {
      console.log('No customers found');
      return [];
    }
    
    const customers: Customer[] = customerSnapshot.docs.map(doc => {
      const data = doc.data() as Customer;
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
