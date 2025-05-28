import express, { Router } from 'express';
import customerController from '../controllers/customerController';

const router: Router = express.Router();

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/firebase/:uid', customerController.getCustomerByFirebaseUid);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
