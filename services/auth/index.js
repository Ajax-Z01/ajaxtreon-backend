const express = require('express');
const router = express.Router();
const { authController } = require('./controllers');
const { authenticateUser } = require('@shared/middlewares/authMiddleware');

// @route POST /api/auth/register
router.post('/register', authController.registerUser);

// @route GET /api/auth/me
router.get('/profile', authenticateUser, authController.getUserProfile);

module.exports = router;
