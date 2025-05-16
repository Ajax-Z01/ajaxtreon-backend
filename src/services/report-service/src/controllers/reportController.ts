import { Request, Response } from 'express';
import reportService from '../services/reportService';

const getSalesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      res.status(400).json({ message: 'Invalid query parameters' });
      return;
    }

    const report = await reportService.generateSalesReport(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Error generating sales report', error: (error as Error).message });
  }
};

const getPurchaseReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      res.status(400).json({ message: 'Invalid query parameters' });
      return;
    }

    const report = await reportService.generatePurchaseReport(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating purchase report:', error);
    res.status(500).json({ message: 'Error generating purchase report', error: (error as Error).message });
  }
};

const getStockReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      res.status(400).json({ message: 'Invalid query parameters' });
      return;
    }

    const report = await reportService.generateStockReport(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating stock report:', error);
    res.status(500).json({ message: 'Error generating stock report', error: (error as Error).message });
  }
};

const getStockHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      res.status(400).json({ message: 'Invalid query parameters' });
      return;
    }

    const history = await reportService.generateStockHistory(startDate, endDate);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error generating stock history report:', error);
    res.status(500).json({ message: 'Error generating stock history report', error: (error as Error).message });
  }
};

const getRevenueReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      res.status(400).json({ message: 'Invalid query parameters' });
      return;
    }

    const report = await reportService.generateRevenueReport(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: 'Error generating revenue report', error: (error as Error).message });
  }
};

export default {
  getSalesReport,
  getPurchaseReport,
  getStockReport,
  getStockHistory,
  getRevenueReport
};
