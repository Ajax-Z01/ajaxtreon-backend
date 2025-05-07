const express = require('express');
const { check } = require('express-validator');
const { productController } = require('../controllers');

const router = express.Router();

// Get all products
router.get('/', productController.getProducts);

// Add new product
router.post(
  '/',
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    check('categoryId').notEmpty().withMessage('Category ID is required'),
  ],
  productController.addProduct
);

// Update product
router.put(
  '/:id',
  [
    check('name').optional().notEmpty().withMessage('Name cannot be empty'),
    check('price').optional().isNumeric().withMessage('Price must be a number'),
    check('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    check('categoryId').optional().notEmpty().withMessage('Category ID cannot be empty'),
  ],
  productController.updateProduct
);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
