import { Router } from 'express';
import orderController from '../controllers/orderController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router = Router();

// Get all orders
router.get('/', orderController.getOrders);

// Middleware to authenticate and authorize admin
router.use(authenticateUser);

// Get orders by customer ID
router.get('/customer/:customerId', orderController.getOrdersByCustomer);

// Add new order
router.post('/', orderController.addOrder);

// Update order
router.put('/:id', orderController.updateOrder);

// Delete order
router.delete('/:id', orderController.deleteOrder);

export default router;
