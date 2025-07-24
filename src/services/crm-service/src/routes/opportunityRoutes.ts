import express, { Router } from 'express';
import opportunityController from '../controllers/opportunityController';
import { authenticateUser, authorizeAdmin } from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

router.use(authenticateUser);

router.get('/', opportunityController.getAllOpportunities);
router.get('/:id', opportunityController.getOpportunityById);

router.use(authorizeAdmin);

router.post('/', opportunityController.createOpportunity);
router.put('/:id', opportunityController.updateOpportunity);
router.delete('/:id', opportunityController.deleteOpportunity);

export default router;
