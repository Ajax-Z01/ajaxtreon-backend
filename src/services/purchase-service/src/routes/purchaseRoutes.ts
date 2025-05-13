import express, { Router } from 'express';
import purchaseController from '../controllers/purchaseController';

const router: Router = express.Router();

router.post('/', purchaseController.addPurchase);

router.get('/', purchaseController.getPurchases);

router.get('/:id', purchaseController.getPurchaseById);

router.put('/:id/status', purchaseController.updatePurchaseStatus);

router.delete('/:id', purchaseController.deletePurchase);

export default router;
