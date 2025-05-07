const { validationResult } = require('express-validator');
const orderModel = require('../models/orderModel');
const OrderDTO = require('../dtos/orderDTO');

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newOrder = req.body;
    if (!OrderDTO.validate(newOrder)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    const orderId = await orderModel.addOrder(newOrder);
    res.status(201).json({ id: orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updatedOrder = req.body;

    if (!OrderDTO.validate(updatedOrder)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    await orderModel.updateOrder(id, updatedOrder);
    res.json({ message: 'Order updated' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderModel.deleteOrder(id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};
