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

export default {
  getSalesReport,
  getPurchaseReport,
};
