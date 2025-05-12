import express, { Router } from 'express';
import productController from '../controllers/productController';

const router: Router = express.Router();

// Get all products
router.get('/', productController.getProducts);

// Add new product
router.post('/', productController.addProduct);

// Update product
router.put('/:id', productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

export default router;
