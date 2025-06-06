import express, { Router } from 'express';
import paymentController from '../controllers/paymentController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

router.post('/', paymentController.addPayment);

router.get('/', paymentController.getPayments);

router.get('/:id', paymentController.getPaymentById);

router.put('/:id/status', paymentController.updatePaymentStatus);

// Middleware to authenticate user and authorize admin
router.use(authenticateUser, authorizeAdmin);

router.delete('/:id', paymentController.deletePayment);

export default router;
