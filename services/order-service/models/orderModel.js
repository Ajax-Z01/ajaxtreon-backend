const db = require('firebase-admin').firestore();
const OrderDTO = require('../dtos/orderDTO');

const getOrders = async () => {
  const snapshot = await db.collection('orders')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    if (data.isDeleted === undefined) {
      data.isDeleted = false;
    }
    return { id: doc.id, ...data };
  }).filter(order => order.isDeleted !== true);
};


const addOrderWithTransaction = async (orderData) => {
  const orderRef = db.collection('orders').doc();
  const productRef = db.collection('products').doc(orderData.productId);

  await db.runTransaction(async (t) => {
    const productDoc = await t.get(productRef);
    if (!productDoc.exists) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();
    if (productData.stock < orderData.quantity) {
      throw new Error('Insufficient stock');
    }

    const newStock = productData.stock - orderData.quantity;
    t.update(productRef, { stock: newStock });

    t.set(orderRef, {
      customerId: orderData.customerId,
      productId: orderData.productId,
      quantity: orderData.quantity,
      status: orderData.status,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const stockLogRef = db.collection('stock_changes').doc();
    t.set(stockLogRef, {
      product_id: orderData.productId,
      change_type: 'subtract',
      quantity: orderData.quantity,
      timestamp: new Date(),
      note: 'Order placed via transaction',
    });
  });

  return orderRef.id;
};

const updateOrder = async (id, newStatus) => {
  const validStatuses = ['pending', 'completed', 'cancelled'];

  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid status');
  }

  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  await orderRef.update({
    status: newStatus,
    updatedAt: new Date(),
  });
};

const deleteOrder = async (id) => {
  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  await orderRef.update({
    isDeleted: true,
    deletedAt: new Date(),
  });
};

module.exports = {
  getOrders,
  addOrderWithTransaction,
  updateOrder,
  deleteOrder,
};
