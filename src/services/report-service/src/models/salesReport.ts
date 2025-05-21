import { queryByDateRange, toTimestampRange } from './utils';
import { SalesReportDTO } from '../dtos/salesReportDTO';
import { Order } from '../types/order';

export const getSalesData = async (startDate: string, endDate: string): Promise<SalesReportDTO[]> => {
  const { startTimestamp, endTimestamp } = toTimestampRange(startDate, endDate);
  try {
    const orders = await queryByDateRange<Order>(
      'orders',
      startTimestamp,
      endTimestamp,
      [['isDeleted', '==', false]]
    );

    const salesData: SalesReportDTO[] = [];
    for (const order of orders) {
      const dto = SalesReportDTO.fromOrder(order);
      if (dto) salesData.push(dto);
    }

    return salesData;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Error fetching sales data');
  }
};
