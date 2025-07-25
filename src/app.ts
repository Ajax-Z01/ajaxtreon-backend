import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import 'module-alias/register';
import cookieParser from 'cookie-parser';

import authService from './services/auth-service/src';
import userService from './services/user-service/src';
import inventoryService from './services/inventory-service/src';
import paymentService from './services/payment-service/src';
import purchaseService from './services/purchase-service/src';
import orderService from './services/order-service/src';
import reportService from 'services/report-service/src';
import supplierService from 'services/supplier-service/src';
import customerService from 'services/customer-service/src';
import sellerService from 'services/seller-service/src';
import notificationService from 'services/notification-service/src';
import crmService from 'services/crm-service/src';
import activityService from 'services/activity-service/src';

dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => {
  res.send('Ajaxtreon API Gateway is running 🚀');
});

app.use('/auth', authService);
app.use('/user', userService);
app.use('/inventory', inventoryService);
app.use('/payment', paymentService);
app.use('/purchase', purchaseService);
app.use('/order', orderService);
app.use('/report', reportService);
app.use('/supplier', supplierService);
app.use('/customer', customerService);
app.use('/seller', sellerService);
app.use('/notification', notificationService);
app.use('/crm', crmService);
app.use('/activity', activityService);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
