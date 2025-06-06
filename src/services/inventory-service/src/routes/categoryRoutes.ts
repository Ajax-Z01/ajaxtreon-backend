import express, { Router } from 'express';
import categoryController from '../controllers/categoryController';
import {
  authenticateUser,
  authorizeAdmin,
} from '@shared/middlewares/authMiddleware';

const router: Router = express.Router();

router.get('/', categoryController.getCategories);

router.use(authenticateUser, authorizeAdmin);

router.post('/', categoryController.addCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
