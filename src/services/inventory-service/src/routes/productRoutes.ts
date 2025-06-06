import express, { Router } from 'express';
import productController from '../controllers/productController';
import {
  authenticateUser,
  authorizeRoles,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

// Get all products
router.get('/', productController.getProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Middleware to authenticate user
router.use(authenticateUser, authorizeRoles('admin', 'seller'));

// Add new product
router.post('/', productController.addProduct);

// Update product
router.put('/:id', productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

export default router;
