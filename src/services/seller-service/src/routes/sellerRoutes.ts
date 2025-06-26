import express, { Router } from 'express';
import sellerController from '../controllers/sellerController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

// Get seller by Firebase UID
router.get('/firebase/:firebaseUid', sellerController.getSellerByFirebaseUid);

router.use(authenticateUser, authorizeAdmin);

// Create a new seller
router.post('/', sellerController.createSeller);
    
// Get all sellers
router.get('/', sellerController.getAllSellers);

// Get seller by ID
router.get('/:id', sellerController.getSellerById);

// Update seller
router.put('/:id', sellerController.updateSeller);

// Delete seller
router.delete('/:id', sellerController.deleteSeller);

export default router;