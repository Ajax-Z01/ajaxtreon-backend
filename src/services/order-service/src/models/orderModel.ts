import admin from '@shared/firebaseAdmin';
import OrderDTO from '../dtos/orderDTO';
import { Order } from '../types/order';
import { StockChange } from '../types/stock';
import { Payment } from '../types/payment';

const db = admin.firestore();
const Timestamp = admin.firestore.Timestamp;

db.settings({ ignoreUndefinedProperties: true });

// Function to clean undefined values
function cleanObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(cleanObject);

  if (obj !== null && typeof obj === 'object') {
    if (obj instanceof Timestamp || obj instanceof Date) return obj;

    const cleaned: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined) {
        cleaned[key] = cleanObject(value);
      }
    });
    return cleaned;
  }

  return obj;
}

// GET orders
const getOrders = async (): Promise<Order[]> => {
  const snapshot = await db.collection('orders').get();
  return snapshot.docs
    .map(doc => {
      const dto = OrderDTO.fromFirestore(doc);
      return OrderDTO.toFirestore(dto);
    })
    .filter(order => !order.isDeleted);
};

// ADD order with transaction
const addOrderWithTransaction = async (rawData: any): Promise<string> => {
  if (!rawData.items || !Array.isArray(rawData.items) || rawData.items.length === 0) {
    throw new Error('Items must be a non-empty array');
  }

  // Hitung totalAmount
  const totalAmount = rawData.items.reduce((sum: number, item: any) => {
    const unitPrice = item.unitPrice ?? 0;
    const quantity = item.quantity ?? 0;
    const discount = item.discount ?? 0;
    const tax = item.tax ?? 0;
    const priceAfterDiscount = unitPrice * quantity - discount;
    const priceWithTax = priceAfterDiscount + tax;
    return sum + priceWithTax;
  }, 0);

  const now = new Date();

  const order = new OrderDTO({
    id: '',
    customerId: rawData.customerId,
    status: rawData.status || 'pending',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    items: rawData.items,
    totalAmount,
    discount: rawData.discount,
    tax: rawData.tax,
    paymentMethod: rawData.paymentMethod,
    refundAmount: rawData.refundAmount,
    paymentId: rawData.paymentId,
    createdBy: rawData.createdBy,
  });

  const validationErrors = OrderDTO.validate(order);
  if (validationErrors.length > 0) {
    throw new Error('Invalid order data: ' + validationErrors.join(', '));
  }

  const orderRef = db.collection('orders').doc();
  const paymentRef = db.collection('payments').doc();

  await db.runTransaction(async (t) => {
    for (const item of order.items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await t.get(productRef);
      if (!productDoc.exists) throw new Error(`Product not found: ${item.productId}`);

      const product = productDoc.data();
      if (!product) throw new Error(`Product data is undefined for ${item.productId}`);

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      t.update(productRef, { stock: product.stock - item.quantity });

      const stockLogRef = db.collection('stock_changes').doc();
      const stockChange: StockChange = {
        productId: item.productId,
        changeType: 'subtract',
        quantity: item.quantity,
        timestamp: Timestamp.fromDate(now),
        note: 'Order placed via transaction',
      };
      t.set(stockLogRef, cleanObject(stockChange));
    }

    t.set(orderRef, cleanObject(OrderDTO.toFirestore({ ...order, id: orderRef.id })));

    const payment: Payment = {
      orderId: orderRef.id,
      amount: totalAmount,
      status: 'pending',
      method: rawData.paymentMethod ?? undefined,
      createdAt: Timestamp.fromDate(now),
    };
    t.set(paymentRef, cleanObject(payment));
  });

  return orderRef.id;
};

// UPDATE order status
const updateOrder = async (id: string, status: string): Promise<void> => {
  if (!OrderDTO.validateUpdate(status)) {
    throw new Error('Invalid status value');
  }

  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();
  if (!orderDoc.exists) throw new Error('Order not found');

  await orderRef.update({
    status,
    updatedAt: Timestamp.fromDate(new Date()),
  });
};

// DELETE order (soft delete)
const deleteOrder = async (id: string): Promise<void> => {
  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();
  if (!orderDoc.exists) throw new Error('Order not found');

  await orderRef.set({
    isDeleted: true,
    deletedAt: Timestamp.fromDate(new Date()),
  }, { merge: true });
};

export default {
  getOrders,
  addOrderWithTransaction,
  updateOrder,
  deleteOrder,
};
