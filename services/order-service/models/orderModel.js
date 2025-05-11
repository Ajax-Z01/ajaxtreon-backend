const db = require('firebase-admin').firestore();
const OrderDTO = require('../dtos/orderDTO');

// GET orders
const getOrders = async () => {
  const snapshot = await db.collection('orders').get();
  return snapshot.docs
    .map(doc => {
      const data = doc.data();
      if (data.isDeleted === undefined) data.isDeleted = false;
      return { id: doc.id, ...data };
    })
    .filter(order => !order.isDeleted);
};

// ADD order with transaction
const addOrderWithTransaction = async (rawData) => {
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
    if (product.stock < order.quantity) throw new Error('Insufficient stock');

    const newStock = product.stock - order.quantity;
    const totalPrice = product.price * order.quantity;

    t.update(productRef, { stock: newStock });
    t.set(orderRef, OrderDTO.transformToFirestore(order));
    t.set(stockLogRef, {
      product_id: order.productId,
      change_type: 'subtract',
      quantity: order.quantity,
      timestamp: new Date(),
      note: 'Order placed via transaction',
    });

    t.set(paymentRef, {
      orderId: orderRef.id,
      amount: totalPrice,
      status: 'pending',
      method: null,
      createdAt: new Date(),
    });
  });

  return orderRef.id;
};

// UPDATE order status
const updateOrder = async (id, status) => {
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
    updatedAt: new Date(),
  });
};

// DELETE order
const deleteOrder = async (id) => {
  const orderRef = db.collection('orders').doc(id);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    throw new Error('Order not found');
  }

  await orderRef.set({
    isDeleted: true,
    deletedAt: new Date(),
  }, { merge: true });
};

module.exports = {
  getOrders,
  addOrderWithTransaction,
  updateOrder,
  deleteOrder,
};
