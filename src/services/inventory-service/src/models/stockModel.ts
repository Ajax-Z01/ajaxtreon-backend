import admin from '@shared/firebaseAdmin';
import { StockChange, ChangeType } from '../types/stock';
import StockDTO from '../dtos/stockDTO';
import { Timestamp } from 'firebase-admin/firestore';

const firestore = admin.firestore;
const db = firestore();

const logStockChange = async (
  productId: string,
  changeType: ChangeType,
  quantity: number,
  note?: string
): Promise<void> => {
  const stockChange: StockChange = {
    productId,
    changeType,
    quantity,
    timestamp: Timestamp.fromDate(new Date()),
    note: note || '',
  };

  await db.collection('stock_changes').add(stockChange);
};

const updateProductStock = async (
  productId: string,
  quantityChange: number
): Promise<number> => {
  const productRef = db.collection('products').doc(productId);

  return db.runTransaction(async (transaction) => {
    const productDoc = await transaction.get(productRef);

    if (!productDoc.exists) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();

    if (!productData || typeof productData.stock !== 'number') {
      throw new Error('Invalid product data');
    }

    const newStock = productData.stock + quantityChange;
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    transaction.update(productRef, { 
      stock: newStock, 
      updatedAt: Timestamp.fromDate(new Date()),
    });

    return newStock;
  });
};

const getStockChangeHistory = async (
  productId: string
): Promise<StockChange[]> => {
  const snapshot = await db
    .collection('stock_changes')
    .where('productId', '==', productId)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map((doc) => doc.data() as StockChange);
};

const getStockReportList = async (): Promise<StockDTO[]> => {
  const snapshot = await db.collection('products').get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return new StockDTO(
      doc.id,
      data.productName || data.name || '',
      data.stock || 0,
      data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      data.category || undefined
    );
  });
};

export default {
  logStockChange,
  updateProductStock,
  getStockChangeHistory,
  getStockReportList,
};
