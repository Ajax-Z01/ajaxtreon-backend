const express = require('express');
const { paymentController } = require('../controllers');

const router = express.Router();

router.post('/', paymentController.addPayment);

router.get('/', paymentController.getPayments);

router.get('/:id', paymentController.getPaymentById);

router.put('/:id/status', paymentController.updatePaymentStatus);

router.delete('/:id', paymentController.deletePayment);

module.exports = router;
