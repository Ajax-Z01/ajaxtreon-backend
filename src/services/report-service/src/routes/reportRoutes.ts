import express, { Router } from 'express';
import reportController from '../controllers/reportController';

const router : Router = express.Router();

router.get('/sales', reportController.getSalesReport);

router.get('/purchases', reportController.getPurchaseReport);

router.get('/stocks', reportController.getStockReport);

router.get('/stock-history', reportController.getStockHistory);

router.get('/revenue', reportController.getRevenueReport);

export default router;
