import express, { Router } from 'express';
import authController from '../controllers/authController';

const router: Router = express.Router();

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Auth service is running' });
});

// @route POST /api/auth/register
router.post('/register', authController.registerUser);

// @route POST /api/auth/register-customer
router.post('/register-customer', authController.registerCustomer);

// @route POST /api/auth/register-supplier
router.post('/register-supplier', authController.registerSupplier);

// @route POST /api/auth/register-seller
router.post('/register-seller', authController.registerSeller);

// @route POST /api/auth/login
router.post('/login', authController.login);

// @route POST /api/auth/logout
router.post('/logout', authController.logout);

// @route GET /api/auth/me
router.get('/me', authController.me); 

export default router;
