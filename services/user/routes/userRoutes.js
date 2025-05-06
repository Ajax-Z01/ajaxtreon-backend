const express = require('express');
const { check } = require('express-validator');
const { userController } = require('../controllers');
const { authenticateUser, authorizeAdmin } = require('@shared/middlewares/authMiddleware');

const router = express.Router();

// Create a new user
router.post('/', 
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  check('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  userController.createUserController
);

// Get all users (Admin only)
router.get('/', 
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
router.put('/:id',
  authenticateUser,
  check('email').isEmail().optional(),
  check('name').notEmpty().optional(),
  check('role').isIn(['admin', 'user']).optional(),
  userController.updateUserInfo
);

// Set user role (Admin only)
router.put('/:id/role', 
  authenticateUser, 
  authorizeAdmin,
  check('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  userController.setUserRole
);

// Delete user (Admin only)
router.delete('/:id',
  authenticateUser,
  authorizeAdmin,
  userController.deleteUserInfo
);

module.exports = router;
