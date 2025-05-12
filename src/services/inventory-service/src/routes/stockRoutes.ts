import express, { Router } from 'express';
import stockController from '../controllers/stockController';

const router: Router = express.Router();

// Add stock
router.post('/add-stock/:id', stockController.addStock);

// Subtract stock
router.post('/subtract-stock/:id', stockController.subtractStock);

// Get stock change history
router.get('/stock-history/:id', stockController.getStockHistory);

export default router;
