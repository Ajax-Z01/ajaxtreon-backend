import { Request, Response } from 'express';
import orderModel from '../models/orderModel';
import { OrderPayload } from '../types/order';

const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderModel.getOrders();
    res.status(200).json(orders);
  } catch (error: unknown) {
    handleError(error, res, 'Error getting orders');
  }
};

const addOrder = async (req: Request<{}, {}, OrderPayload>, res: Response): Promise<void> => {
  try {
    const { orderId, paymentId, midtransResult } = await orderModel.addOrderWithTransaction(req.body);
    res.status(201).json({
      orderId,
      paymentId,
      paymentInfo: midtransResult,
    });
  } catch (error: unknown) {
    handleError(error, res, 'Transaction failed');
  }
};

const updateOrder = async (req: Request<{ id: string }, {}, { status: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
    res.status(400).json({ message: 'Invalid status value' });
    return;
  }

  try {
    await orderModel.updateOrder(id, status);
    res.status(200).json({ message: 'Order status updated' });
  } catch (error: unknown) {
    handleError(error, res, 'Error updating order');
  }
};

const deleteOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await orderModel.deleteOrder(id);
    res.status(200).json({ message: 'Order soft-deleted successfully' });
  } catch (error: unknown) {
    handleError(error, res, 'Error deleting order');
  }
};

// Helper function to handle errors consistently
const handleError = (error: unknown, res: Response, message: string): void => {
  if (error instanceof Error) {
    console.error(message, error.message);
    res.status(500).json({ message: error.message });
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

const getOrdersByCustomer = async (req: Request<{ customerId: string }>, res: Response): Promise<void> => {
  const { customerId } = req.params;

  try {
    const orders = await orderModel.getOrdersByCustomer(customerId);
    res.status(200).json(orders);
  } catch (error: unknown) {
    handleError(error, res, 'Error getting customer orders');
  }
};

export default {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
};
