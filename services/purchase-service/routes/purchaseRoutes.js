const express = require('express');
const { purchaseController } = require('../controllers');

const router = express.Router();

// Get all purchases
router.get('/purchases', purchaseController.getPurchases);

// Get purchase by ID
router.get('/purchases/:id', purchaseController.getPurchaseById);

// Add a new purchase
router.post('/purchases', purchaseController.addPurchase);

// Update purchase status
router.put('/purchases/:id/status', purchaseController.updatePurchaseStatus);

// Delete a purchase
router.delete('/purchases/:id', purchaseController.deletePurchase);

module.exports = router;
