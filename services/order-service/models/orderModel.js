const db = require('firebase-admin').firestore();

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

const addOrderWithTransaction = async (rawData) => {
  const dto = new OrderDTO(
    rawData.customerId,
    rawData.productId,
    rawData.quantity,
    rawData.status || 'pending'
  );

  if (!OrderDTO.validate(dto)) {
    throw new Error('Invalid order data');
  }

  const orderRef = db.collection('orders').doc();
  const productRef = db.collection('products').doc(dto.productId);
  const paymentRef = db.collection('payments').doc();
  const stockLogRef = db.collection('stock_changes').doc();

  await db.runTransaction(async (t) => {
    const productDoc = await t.get(productRef);
    if (!productDoc.exists) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();

    if (productData.stock < dto.quantity) {
      throw new Error('Insufficient stock');
    }

    const newStock = productData.stock - dto.quantity;
    const totalPrice = productData.price * dto.quantity;
    const now = new Date();

    t.update(productRef, { stock: newStock });

    t.set(orderRef, {
      customerId: dto.customerId,
      productId: dto.productId,
      quantity: dto.quantity,
      totalPrice,
      status: dto.status,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });

    t.set(stockLogRef, {
      product_id: dto.productId,
      change_type: 'subtract',
      quantity: dto.quantity,
      timestamp: now,
      note: 'Order placed via transaction'
    });

    t.set(paymentRef, {
      orderId: orderRef.id,
      amount: totalPrice,
      status: 'pending',
      method: null,
      createdAt: now,
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
