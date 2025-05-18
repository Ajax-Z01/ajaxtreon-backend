import { queryByDateRange, toTimestampRange } from './utils';
import { PurchaseReportDTO } from '../dtos/purchaseReportDTO';
import { Purchase } from '../types/purchase';

export const getPurchaseData = async (startDate: string, endDate: string): Promise<PurchaseReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);
  try {
    const purchases = await queryByDateRange<Purchase>('purchases', startTimestamp, endTimestamp, [['isDeleted', '==', false]]);
    return purchases.map(p => PurchaseReportDTO.fromFirestore(p));
  } catch (error) {
    console.error('Error fetching purchase data:', error);
    throw new Error('Error fetching purchase data');
  }
};
