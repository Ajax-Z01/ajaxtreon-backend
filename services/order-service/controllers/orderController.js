const { validationResult } = require('express-validator');
const orderModel = require('../models/orderModel');

const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.getOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: error.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const orderId = await orderModel.addOrderWithTransaction(req.body);
    res.status(201).json({ id: orderId });
  } catch (error) {
    console.error('Transaction failed:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    await orderModel.updateOrder(id, status);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: error.message });
  }
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
  addOrder,
  updateOrder,
  deleteOrder,
};
