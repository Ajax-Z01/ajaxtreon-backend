const express = require('express');
const { check } = require('express-validator');
const { categoryController } = require('../controllers');

const router = express.Router();

// Get all categories
router.get('/', categoryController.getCategories);

// Add new category
router.post(
  '/',
  [
    check('name').notEmpty().withMessage('Category name is required'),
    check('description').optional().isString().withMessage('Description must be a string'),
  ],
  categoryController.addCategory
);

// Update category
router.put(
  '/:id',
  [
    check('name').optional().notEmpty().withMessage('Category name cannot be empty'),
    check('description').optional().isString().withMessage('Description must be a string'),
  ],
  categoryController.updateCategory
);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
