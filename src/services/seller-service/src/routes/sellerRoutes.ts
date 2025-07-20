import express, { Router } from 'express';
import sellerController from '../controllers/sellerController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

// Public route to get seller by Firebase UID
router.get('/firebase/:firebaseUid', sellerController.getSellerByFirebaseUid);

// Authenticated routes
router.use(authenticateUser);

// Get current seller
router.get('/me', sellerController.getMe);

// Update seller
router.put('/:id', sellerController.updateSeller);

// Authenticated routes
router.use(authorizeAdmin);

// Create a new seller
router.post('/', sellerController.createSeller);

// Get all sellers
router.get('/', sellerController.getAllSellers);

// Get seller by ID
router.get('/:id', sellerController.getSellerById);

// Delete seller
router.delete('/:id', sellerController.deleteSeller);

export default router;
