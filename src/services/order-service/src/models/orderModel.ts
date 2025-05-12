import admin from '@shared/firebaseAdmin';
import OrderDTO from '../dtos/orderDTO';
import { Order, StockChange, Payment } from '../types/order';

const db = admin.firestore();
const firestore = admin.firestore;

// GET orders
const getOrders = async (): Promise<Order[]> => {
  const snapshot = await db.collection('orders').get();
  return snapshot.docs
    .map(doc => {
      const data = doc.data();
      const order = { id: doc.id, ...data } as Order;

      if (order.isDeleted === undefined) {
        order.isDeleted = false;
      }

      return order;
    })
    .filter(order => !order.isDeleted);
};

// ADD order with transaction
const addOrderWithTransaction = async (rawData: any): Promise<string> => {
  const order = new OrderDTO(
    rawData.customerId,
    rawData.productId,
    rawData.quantity,
    rawData.status || 'pending'
  );

  const validationErrors = OrderDTO.validate(order);
  if (validationErrors.length > 0) {
    throw new Error('Invalid order data: ' + validationErrors.join(', '));
  }

  const orderRef = db.collection('orders').doc();
  const productRef = db.collection('products').doc(order.productId);
  const paymentRef = db.collection('payments').doc();
  const stockLogRef = db.collection('stock_changes').doc();

  await db.runTransaction(async (t) => {
    const productDoc = await t.get(productRef);
    if (!productDoc.exists) throw new Error('Product not found');

    const product = productDoc.data();
    
    // Ensure 'product' is not undefined before using it
    if (!product) {
      throw new Error('Product data is undefined');
    }

    if (product.stock < order.quantity) throw new Error('Insufficient stock');

    const newStock = product.stock - order.quantity;
    const totalPrice = product.price * order.quantity;

    t.update(productRef, { stock: newStock });
    t.set(orderRef, OrderDTO.transformToFirestore(order));

    // Convert 'timestamp' to Firestore's Timestamp type
    t.set(stockLogRef, {
      product_id: order.productId,
      change_type: 'subtract',
      quantity: order.quantity,
      timestamp: firestore.Timestamp.fromDate(new Date()), // Use Firestore Timestamp
      note: 'Order placed via transaction',
    } as StockChange);

    // Convert 'createdAt' to Firestore's Timestamp type
    t.set(paymentRef, {
      orderId: orderRef.id,
      amount: totalPrice,
      status: 'pending',
      method: null,
      createdAt: firestore.Timestamp.fromDate(new Date()), // Use Firestore Timestamp
    } as Payment);
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

  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  await orderRef.update({
    status,
    updatedAt: firestore.Timestamp.fromDate(new Date()), // Use Firestore Timestamp
  });
};

// DELETE order
const deleteOrder = async (id: string): Promise<void> => {
  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  await orderRef.set({
    isDeleted: true,
    deletedAt: firestore.Timestamp.fromDate(new Date()), // Use Firestore Timestamp
  }, { merge: true });
};

export default {
  getOrders,
  addOrderWithTransaction,
  updateOrder,
  deleteOrder,
};
