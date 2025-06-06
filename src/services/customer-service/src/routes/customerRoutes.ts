import express, { Router } from 'express';
import customerController from '../controllers/customerController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

router.use(authenticateUser);

router.get('/firebase/:uid', customerController.getCustomerByFirebaseUid);
router.put('/:id', customerController.updateCustomer);

router.get('/', authorizeAdmin, customerController.getAllCustomers);
router.get('/:id', authorizeAdmin, customerController.getCustomerById);
router.post('/', authorizeAdmin, customerController.createCustomer);
router.delete('/:id', authorizeAdmin, customerController.deleteCustomer);

export default router;
