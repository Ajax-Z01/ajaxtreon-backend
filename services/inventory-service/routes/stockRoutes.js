const express = require('express');
const { stockController } = require('../controllers');

const router = express.Router();

// Add stock
router.post('/add-stock/:id', stockController.addStock);

// Subtract stock
router.post('/subtract-stock/:id', stockController.subtractStock);

// Get stock change history
router.get('/stock-history/:id', stockController.getStockHistory);

module.exports = router;
