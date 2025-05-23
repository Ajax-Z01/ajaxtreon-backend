import { Router } from 'express';
import orderController from '../controllers/orderController';

const router = Router();

// Get all orders
router.get('/', orderController.getOrders);

// Add new order
router.post('/', orderController.addOrder);

// Update order
router.put('/:id', orderController.updateOrder);

// Delete order
router.delete('/:id', orderController.deleteOrder);

export default router;
