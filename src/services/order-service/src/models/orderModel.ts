import admin from '@shared/firebaseAdmin';
import OrderDTO from '../dtos/orderDTO';
import { Order, OrderStatus, OrderPayload, OrderResponse } from '../types/order';
import { StockChange } from '../types/stock';
import { calculateOrderSummary } from '../utils/order';
import { mapItemDetailsToOrderItem, buildPaymentItems } from '../utils/itemMappers';

import paymentModel from '../../../payment-service/src/models/paymentModel';
import * as paymentService from '../../../payment-service/src/services/paymentService';
import { PaymentData, CreateTransactionPayload, MidtransTransactionResponse } from '../types/payment';

import { sendSystemNotification } from '@shared/utils/sendSystemNotification';

const db = admin.firestore();
const Timestamp = admin.firestore.Timestamp;

db.settings({ ignoreUndefinedProperties: true });

function cleanObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(cleanObject);
  if (obj !== null && typeof obj === 'object') {
    if (obj instanceof Timestamp || obj instanceof Date) return obj;
    const cleaned: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined) cleaned[key] = cleanObject(value);
    });
    return cleaned;
  }
  return obj;
}

const mapTimestamp = (timestamp: FirebaseFirestore.Timestamp | null | undefined) => {
  return timestamp instanceof admin.firestore.Timestamp ? timestamp.toDate() : null;
};

const checkProductAndStock = async (
  t: FirebaseFirestore.Transaction,
  productId: string,
  quantity: number
) => {
  const productRef = db.collection('products').doc(productId);
  const doc = await t.get(productRef);
  if (!doc.exists) throw new Error(`E_PRODUCT_NOT_FOUND: ${productId}`);

  const product = doc.data();
  if (!product || product.stock < quantity) {
    throw new Error(`E_INSUFFICIENT_STOCK: ${productId}`);
  }

  return { productRef, product };
};

const getOrders = async (): Promise<OrderResponse[]> => {
  const snapshot = await db.collection('orders').get();

  return snapshot.docs
    .map(doc => {
      const order = OrderDTO.toFirestore(OrderDTO.fromFirestore(doc));
      return {
        ...order,
        createdAt: mapTimestamp(order.createdAt),
        updatedAt: mapTimestamp(order.updatedAt),
        deletedAt: mapTimestamp(order.deletedAt),
      };
    })
    .filter(order => !order.isDeleted);
};


const addOrderWithTransaction = async (
  payload: OrderPayload
  ): Promise<{ orderId: string; paymentId: string; midtransResult: MidtransTransactionResponse }> => {
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error('E_NO_ITEMS: Items must be a non-empty array');
  } if (!payload.customerId) {
    throw new Error('E_CUSTOMER_ID_MISSING: customerId is required');
  }

  const orderItems = mapItemDetailsToOrderItem(payload.items);

  const { total } = calculateOrderSummary(orderItems, {
    discount: payload.discount,
    taxPercentage: payload.tax,
  });

  const now = Timestamp.now();
  const orderRef = db.collection('orders').doc();

  const order = new OrderDTO({
    id: orderRef.id,
    customerId: payload.customerId,
    status: payload.status || OrderStatus.Pending,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    items: orderItems,
    totalAmount: total,
    discount: payload.discount,
    tax: payload.tax,
    paymentMethod: payload.paymentMethod,
    refundAmount: payload.refundAmount,
    paymentId: '',
    createdBy: payload.createdBy,
  });

  const validationErrors = OrderDTO.validate(order);
  if (validationErrors.length > 0) {
    throw new Error('E_ORDER_INVALID: ' + validationErrors.join(', '));
  }

  await db.runTransaction(async (t) => {
    const productChecks = await Promise.all(
      order.items.map(item => checkProductAndStock(t, item.productId, item.quantity))
    );

    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      const { productRef, product } = productChecks[i];

      t.update(productRef, { stock: product.stock - item.quantity });

      const stockLogRef = db.collection('stock_changes').doc();
      const stockChange: StockChange = {
        productId: item.productId,
        changeType: 'subtract',
        quantity: item.quantity,
        timestamp: now,
        note: 'Order placed via transaction',
      };
      t.set(stockLogRef, cleanObject(stockChange));
    }

    t.set(orderRef, cleanObject(OrderDTO.toFirestore(order)));
  });
  
  const paymentItems = buildPaymentItems(payload.items, payload.discount ?? 0, payload.tax ?? 0);
  
  const grossAmount = paymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const paymentPayload: CreateTransactionPayload = {
    transaction_details: {
      order_id: orderRef.id,
      gross_amount: grossAmount,
    },
    customer_details: payload.customer,
    item_details: paymentItems,
  };

  const midtransResult = await paymentService.createTransaction(paymentPayload);

  const paymentData: Omit<PaymentData, 'id'> = {
    orderId: orderRef.id,
    amount: total,
    method: payload.paymentMethod ?? null,
    status: 'pending',
    transactionId: midtransResult.transaction_id || null,
    fraudStatus: midtransResult.fraud_status || null,
    paymentType: midtransResult.payment_type || null,
    vaNumber: midtransResult.va_numbers?.[0]?.va_number || null,
    pdfUrl: midtransResult.pdf_url || null,
    redirectUrl: midtransResult.redirect_url || null,
    createdAt: new Date(),
    updatedAt: null,
    transactionTime: midtransResult.transaction_time ? new Date(midtransResult.transaction_time) : null,
  };

  const paymentId = await paymentModel.createPayment(paymentData);

  await orderRef.update({ paymentId });
  
  await sendSystemNotification(
    payload.customerId,
    'Pesanan berhasil dibuat',
    `Pesanan #${orderRef.id} telah berhasil dibuat.`,
    'success'
  );

  return {
    orderId: orderRef.id,
    paymentId,
    midtransResult,
  };
};

const updateOrder = async (id: string, status: string): Promise<void> => {
  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    throw new Error('E_INVALID_STATUS');
  }

  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();
  if (!orderDoc.exists) throw new Error('E_ORDER_NOT_FOUND');

  await orderRef.update({
    status: status as OrderStatus,
    updatedAt: Timestamp.now(),
  });
  
  await sendSystemNotification(
    orderDoc.data()?.customerId || null,
    'Status pesanan diperbarui',
    `Status pesanan #${id} telah diubah menjadi "${status}".`,
    'info'
  );
};

const deleteOrder = async (id: string): Promise<void> => {
  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();
  if (!orderDoc.exists) throw new Error('E_ORDER_NOT_FOUND');

  await orderRef.set(
    {
      isDeleted: true,
      deletedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

const getOrdersByCustomer = async (customerId: string): Promise<OrderResponse[]> => {
  const snapshot = await db
    .collection('orders')
    .where('customerId', '==', customerId)
    .where('isDeleted', '==', false)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => {
    const order = OrderDTO.toFirestore(OrderDTO.fromFirestore(doc));
    return {
      ...order,
      createdAt: mapTimestamp(order.createdAt),
      updatedAt: mapTimestamp(order.updatedAt),
      deletedAt: mapTimestamp(order.deletedAt),
    };
  });
};

export default {
  getOrders,
  addOrderWithTransaction,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
};
