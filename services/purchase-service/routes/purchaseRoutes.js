const express = require('express');
const { purchaseController } = require('../controllers');

const router = express.Router();

// Get all purchases
router.get('/', purchaseController.getPurchases);

// Get purchase by ID
router.get('/:id', purchaseController.getPurchaseById);

// Add a new purchase
router.post('/', purchaseController.addPurchase);

// Update purchase status
router.put('/:id/status', purchaseController.updatePurchaseStatus);

// Delete a purchase
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
