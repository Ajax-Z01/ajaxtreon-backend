import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import 'module-alias/register';

// Import the services
import authService from './services/auth-service/src';
import userService from './services/user-service/src';
import inventoryService from './services/inventory-service/src';
import paymentService from './services/payment-service/src';
import purchaseService from './services/purchase-service/src';
import orderService from './services/order-service/src';
import reportService from 'services/report-service/src';
import supplierService from 'services/supplier-service/src';
import customerService from 'services/customer-service/src';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Ajaxtreon API Gateway is running 🚀');
});

// Mount the services
app.use('/auth', authService);
app.use('/user', userService);
app.use('/inventory', inventoryService);
app.use('/payment', paymentService);
app.use('/purchase', purchaseService);
app.use('/order', orderService);
app.use('/report', reportService);
app.use('/supplier', supplierService);
app.use('/customer', customerService);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
