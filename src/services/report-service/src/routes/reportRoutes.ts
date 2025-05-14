import express, { Router } from 'express';
import reportController from '../controllers/reportController';

const router : Router = express.Router();

router.get('/sales', reportController.getSalesReport);

router.get('/purchases', reportController.getPurchaseReport);

export default router;
