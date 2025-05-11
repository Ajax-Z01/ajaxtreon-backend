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
    res.status(400).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await orderModel.updateOrder(id, status);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await orderModel.deleteOrder(id);
    res.json({ message: 'Order soft-deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};
