import reportModel from '../models/reportModel';

const generateSalesReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const salesData = await reportModel.getSalesData(startDate, endDate);
    return salesData;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating sales report');
  }
};

const generatePurchaseReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const purchaseData = await reportModel.getPurchaseData(startDate, endDate);
    return purchaseData;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating purchase report');
  }
};

export default {
  generateSalesReport,
  generatePurchaseReport,
};
