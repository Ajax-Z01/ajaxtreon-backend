const express = require('express');
const { check } = require('express-validator');
const { orderController } = require('../controllers');

const router = express.Router();

// Get all orders
router.get('/', orderController.getOrders);

// Add new order
router.post(
  '/',
  [
    check('productId').notEmpty().withMessage('Product ID is required'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    check('totalPrice').isNumeric().withMessage('Total price must be a number'),
    check('status').optional().isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status'),
  ],
  orderController.addOrder
);

// Update order
router.put(
  '/:id',
  [
    check('productId').optional().notEmpty().withMessage('Product ID cannot be empty'),
    check('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    check('totalPrice').optional().isNumeric().withMessage('Total price must be a number'),
    check('status').optional().isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status'),
  ],
  orderController.updateOrder
);

// Delete order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
