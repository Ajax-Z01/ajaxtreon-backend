const { validationResult } = require('express-validator');
const paymentModel = require('../models/paymentModel');

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add new payment
const addPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orderId, amount, method } = req.body;
    const paymentData = { orderId, amount, method, status: 'pending', createdAt: new Date(), updatedAt: new Date() };
    const paymentId = await paymentModel.createPayment(paymentData);
    res.status(201).json({ message: 'Payment created', paymentId });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status } = req.body;
    const { id } = req.params;
    await paymentModel.updatePaymentStatus(id, status);
    res.json({ message: 'Payment status updated' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await paymentModel.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error getting payment by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await paymentModel.deletePayment(id);
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  addPayment,
  updatePaymentStatus,
  getPaymentById,
  deletePayment,
};
