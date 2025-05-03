const express = require('express');
const { check } = require('express-validator');
const { userController } = require('./controllers');
const { authenticateUser, authorizeAdmin } = require('@shared/middlewares/authMiddleware');
const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateUser, authorizeAdmin, userController.getAllUsersController);

// Get user by ID
router.get('/:id', authenticateUser, userController.getUser);

// Update user info
router.put('/:id', 
  authenticateUser, 
  check('email').isEmail().optional(),  // Email validation
  check('name').notEmpty().optional(),  // Optional name validation
  check('role').isIn(['admin', 'user']).optional(),  // Optional role validation
  userController.updateUserInfo
);

// Set user role (Admin only)
router.put('/:id/role', 
  authenticateUser, 
  authorizeAdmin,  // Only admins can set roles
  check('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),  // Validate role
  userController.setUserRole
);

// Delete user
router.delete('/:id', authenticateUser, authorizeAdmin, userController.deleteUserInfo);

module.exports = router;
