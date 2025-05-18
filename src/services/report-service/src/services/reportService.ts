import {
  customerReport,
  inventoryTurnover,
  purchaseReport,
  revenueReport,
  salesReport,
  stockReport,
  supplierReport
} from "../models";

const generateSalesReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const salesData = await salesReport.getSalesData(startDate, endDate);
    return salesData;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating sales report');
  }
};

const generatePurchaseReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const purchaseData = await purchaseReport.getPurchaseData(startDate, endDate);
    return purchaseData;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating purchase report');
  }
};

const generateStockReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const stockData = await stockReport.getStockReport(startDate, endDate);
    return stockData;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating stock report');
  }
};

const generateStockHistory = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const stockHistory = await stockReport.getStockChangeHistory(startDate, endDate);
    return stockHistory;
  } catch (error) {
    console.error('Error in reportService:', error);
    throw new Error('Error in generating stock history report');
  }
};

const generateRevenueReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const data = await revenueReport.getRevenueReport(startDate, endDate);
    return data;
  } catch (error) {
    console.error('Error in generating revenue report:', error);
    throw new Error('Error in generating revenue report');
  }
};

const generateCustomerReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const data = await customerReport.getCustomerReport(startDate, endDate);
    return data;
  } catch (error) {
    console.error('Error in generating customer report:', error);
    throw new Error('Error in generating customer report');
  }
};

const generateSupplierReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const data = await supplierReport.getSupplierReport(startDate, endDate);
    return data;
  } catch (error) {
    console.error('Error in generating supplier report:', error);
    throw new Error('Error in generating supplier report');
  }
};

const generateInventoryTurnoverReport = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const data = await inventoryTurnover.getInventoryTurnoverReport(startDate, endDate);
    return data;
  } catch (error) {
    console.error('Error in generating inventory turnover report:', error);
    throw new Error('Error in generating inventory turnover report');
  }
};

export default {
  generateSalesReport,
  generatePurchaseReport,
  generateStockReport,
  generateStockHistory,
  generateRevenueReport,
  generateCustomerReport,
  generateSupplierReport,
  generateInventoryTurnoverReport
};
