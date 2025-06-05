import express, { Router } from 'express';
import sellerController from '../controllers/sellerController';

const router: Router = express.Router();

// Create a new seller
router.post('/', sellerController.createSeller);

// Get all sellers
router.get('/', sellerController.getAllSellers);

// Get seller by ID
router.get('/:id', sellerController.getSellerById);

// Get seller by Firebase UID
router.get('/firebase/:firebaseUid', sellerController.getSellerByFirebaseUid);

// Update seller
router.put('/:id', sellerController.updateSeller);

// Delete seller
router.delete('/:id', sellerController.deleteSeller);

export default router;