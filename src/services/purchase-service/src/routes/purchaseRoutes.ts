import express, { Router } from 'express';
import purchaseController from '../controllers/purchaseController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

router.post('/', purchaseController.addPurchase);

router.get('/', purchaseController.getPurchases);

router.get('/:id', purchaseController.getPurchaseById);

router.put('/:id/status', purchaseController.updatePurchaseStatus);

// Middleware to authenticate user and authorize admin
router.use(authenticateUser, authorizeAdmin);

router.delete('/:id', purchaseController.deletePurchase);

export default router;
