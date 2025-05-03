const db = require('firebase-admin').firestore();
const OrderDTO = require('../dtos/orderDTO');

const getOrders = async () => {
  const snapshot = await db.collection('orders').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addOrder = async (orderData) => {
  const order = new OrderDTO(orderData.customerId, orderData.productId, orderData.quantity, orderData.status);
  const transformedOrder = OrderDTO.transformToFirestore(order);
  const docRef = await db.collection('orders').add(transformedOrder);
  return docRef.id;
};

const updateOrder = async (id, orderData) => {
  const order = new OrderDTO(orderData.customerId, orderData.productId, orderData.quantity, orderData.status);
  const transformedOrder = OrderDTO.transformToFirestore(order);
  await db.collection('orders').doc(id).update(transformedOrder);
};

const deleteOrder = async (id) => {
  await db.collection('orders').doc(id).delete();
};

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};
