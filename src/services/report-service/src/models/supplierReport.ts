import { toTimestampRange } from './utils';
import admin from 'firebase-admin';
import { SupplierReportDTO } from '../dtos/supplierReportDTO';
import { UserData } from '../types/user';
import { Purchase } from '../types/purchase';

const db = admin.firestore();

export const getSupplierReport = async (startDate: string, endDate: string): Promise<SupplierReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);

  try {
    const usersSnapshot = await db.collection('users')
      // .where('role', '==', 'supplier') // Uncomment if needed
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
