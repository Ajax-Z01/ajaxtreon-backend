import { Request, Response } from 'express';
import paymentModel from '../models/paymentModel';
import { PaymentData, PaymentStatus, CreateTransactionPayload } from '../types/Payment';
import * as paymentService from '../services/paymentService';

const getPayments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

const addPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, amount, method, customer, items, userId } = req.body;

    const payload: CreateTransactionPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: customer,
      item_details: items,
    };

    const midtransResult = await paymentService.createTransaction(payload);

    const paymentData: Omit<PaymentData, 'id'> = {
      orderId,
      userId,
      amount,
      method,
      status: 'pending',
      transactionId: midtransResult.transaction_id || null,
      fraudStatus: midtransResult.fraud_status || null,
      paymentType: midtransResult.payment_type || null,
      vaNumber: midtransResult.va_numbers ? midtransResult.va_numbers[0]?.va_number || null : null,
      pdfUrl: midtransResult.pdf_url || null,
      redirectUrl: midtransResult.redirect_url || null,
      createdAt: new Date(),
      updatedAt: null,
      transactionTime: midtransResult.transaction_time ? new Date(midtransResult.transaction_time) : null,
    };

    const paymentId = await paymentModel.createPayment(paymentData);

    res.status(201).json({ message: 'Payment created', paymentId, midtransResult });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

const updatePaymentStatus = async (
  req: Request<{ id: string }, {}, { status: PaymentStatus }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await paymentModel.updatePaymentStatus(id, status);
    res.json({ message: 'Payment status updated' });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(400).json({ message: (error as Error).message });
  }
};

const getPaymentById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const payment = await paymentModel.getPaymentById(id);
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }
    res.json(payment);
  } catch (error) {
    console.error('Error getting payment by ID:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

const deletePayment = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await paymentModel.deletePayment(id);
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export default {
  getPayments,
  addPayment,
  updatePaymentStatus,
  getPaymentById,
  deletePayment,
};
