import { Request, Response } from 'express';
import { firestore } from 'firebase-admin';
import { StockChange, ChangeType } from '../types/stock';

const db = firestore();

// Log stock change
const logStockChange = async (
  productId: string,
  changeType: ChangeType,
  quantity: number,
  note?: string
): Promise<void> => {
  try {
    const timestamp = new Date();
    const stockChange: StockChange = {
      product_id: productId,
      change_type: changeType,
      quantity,
      timestamp,
      note: note || ''
    };
    await db.collection('stock_changes').add(stockChange);
  } catch (error) {
    console.error('Error logging stock change:', error);
  }
};

// Add stock
const addStock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity, note }: { quantity: number; note?: string } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ message: 'Quantity must be a positive number' });
    return;
  }

  try {
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const productData = product.data();
    if (!productData || typeof productData.stock !== 'number') {
      res.status(400).json({ message: 'Invalid product data' });
      return;
    }

    const updatedStock = productData.stock + quantity;
    await productRef.update({ stock: updatedStock });

    await logStockChange(id, 'add', quantity, note);
    res.json({ message: 'Stock added successfully', stock: updatedStock });
  } catch (error: any) {
    console.error('Error adding stock:', error);
    res.status(500).json({ message: error.message });
  }
};

// Subtract stock
const subtractStock = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity, note }: { quantity: number; note?: string } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400).json({ message: 'Quantity must be a positive number' });
    return;
  }

  try {
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const productData = product.data();
    if (!productData || typeof productData.stock !== 'number') {
      res.status(400).json({ message: 'Invalid product data' });
      return;
    }

    const updatedStock = productData.stock - quantity;
    if (updatedStock < 0) {
      res.status(400).json({ message: 'Stock cannot be negative' });
      return;
    }

    await productRef.update({ stock: updatedStock });

    await logStockChange(id, 'subtract', quantity, note);
    res.json({ message: 'Stock subtracted successfully', stock: updatedStock });
  } catch (error: any) {
    console.error('Error subtracting stock:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get stock change history
const getStockHistory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const snapshot = await db
      .collection('stock_changes')
      .where('product_id', '==', id)
      .orderBy('timestamp', 'desc')
      .get();

    if (snapshot.empty) {
      res.status(404).json({ message: 'No stock change history found' });
      return;
    }

    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
