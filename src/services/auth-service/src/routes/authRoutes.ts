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

export default router;
