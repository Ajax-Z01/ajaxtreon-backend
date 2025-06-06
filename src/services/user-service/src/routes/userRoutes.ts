import express, { Router } from 'express';
import userController from '../controllers/userController';
import { authenticateUser, authorizeAdmin } from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

// Create a new user
router.post(
  '/', 
  authenticateUser,
  authorizeAdmin,
  userController.createUserController
);

// Get all users (Admin only)
router.get(
  '/', 
  authenticateUser, 
  authorizeAdmin, 
  userController.getAllUsersController
);

// Get user by ID
router.get('/:id', 
  authenticateUser, 
  userController.getUser
);

// Update user info
router.put(
  '/:id',
  authenticateUser,
  userController.updateUserInfo
);

// Set user role (Admin only)
router.put(
  '/:id/role', 
  authenticateUser, 
  authorizeAdmin,
  userController.setUserRole
);

// Delete user (Admin only)
router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  userController.deleteUserInfo
);

export default router;
