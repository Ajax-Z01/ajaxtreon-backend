import { Router } from 'express';
import defineRoutes from './routes';

const router: Router = Router();

defineRoutes(router);

export default router;
