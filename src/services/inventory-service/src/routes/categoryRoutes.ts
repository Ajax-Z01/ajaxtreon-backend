import express, { Router } from 'express';
import categoryController from '../controllers/categoryController';

const router: Router = express.Router();

// Get all categories
router.get('/', categoryController.getCategories);

// Add new category
router.post('/', categoryController.addCategory);

// Update category
router.put('/:id', categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

export default router;
