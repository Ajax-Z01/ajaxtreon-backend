import express, { Router } from 'express';
import paymentController from '../controllers/paymentController';

const router: Router = express.Router();

router.post('/', paymentController.addPayment);

router.get('/', paymentController.getPayments);

router.get('/:id', paymentController.getPaymentById);

router.put('/:id/status', paymentController.updatePaymentStatus);

router.delete('/:id', paymentController.deletePayment);

export default router;
