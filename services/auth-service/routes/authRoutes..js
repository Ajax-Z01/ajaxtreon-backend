const express = require('express');
const { authController } = require('../controllers');
const { authenticateUser } = require('@shared/middlewares/authMiddleware');

const router = express.Router();

// @route POST /api/auth/register
router.post('/register', authController.registerUser);

// @route GET /api/auth/me
router.get('/profile', authenticateUser, authController.getUserProfile);

module.exports = router;