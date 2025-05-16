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

const generateStockReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const stockData = await reportModel.getStockReport(startDate, endDate);
    return stockData;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating stock report');
  }
};

const generateStockHistory = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const stockHistory = await reportModel.getStockChangeHistory(startDate, endDate);
    return stockHistory;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating stock history report');
  }
};

const generateRevenueReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const data = await reportModel.getRevenueReport(startDate, endDate);
    return data;
  } catch (error) {
    console.error('Error in generating revenue report:', error);
    throw new Error('Error in generating revenue report');
  }
};

export default {
  generateSalesReport,
  generatePurchaseReport,
  generateStockReport,
  generateStockHistory,
  generateRevenueReport,
};
