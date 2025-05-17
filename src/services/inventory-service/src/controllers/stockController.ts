import { Request, Response } from 'express';
import stockModel from '../models/stockModel'
import { ChangeType } from '../types/stock';

const addStock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity, note }: { quantity: number; note?: string } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ message: 'Quantity must be a positive number' });
    return;
  }

  try {
    const updatedStock = await stockModel.updateProductStock(id, quantity);
    await stockModel.logStockChange(id, 'add' as ChangeType, quantity, note);
    res.json({ message: 'Stock added successfully', stock: updatedStock });
  } catch (error: any) {
    console.error('Error adding stock:', error);
    res.status(500).json({ message: error.message });
  }
};

const subtractStock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity, note }: { quantity: number; note?: string } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ message: 'Quantity must be a positive number' });
    return;
  }

  try {
    const updatedStock = await stockModel.updateProductStock(id, -quantity);
    await stockModel.logStockChange(id, 'subtract' as ChangeType, quantity, note);
    res.json({ message: 'Stock subtracted successfully', stock: updatedStock });
  } catch (error: any) {
    console.error('Error subtracting stock:', error);
    res.status(500).json({ message: error.message });
  }
};

const getStockHistory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const history = await stockModel.getStockChangeHistory(id);

    if (history.length === 0) {
      res.status(404).json({ message: 'No stock change history found' });
      return;
    }

    res.json(history);
  } catch (error: any) {
    console.error('Error getting stock change history:', error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  addStock,
  subtractStock,
  getStockHistory,
};
