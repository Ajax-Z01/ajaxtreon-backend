import { Request, Response } from 'express';
import orderModel from '../models/orderModel';
import { OrderRequestBody } from '../types/order';

const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderModel.getOrders();
    res.status(200).json(orders);
  } catch (error: unknown) {
    handleError(error, res, 'Error getting orders');
  }
};

const addOrder = async (req: Request<{}, {}, OrderRequestBody>, res: Response): Promise<void> => {
  try {
    const orderId = await orderModel.addOrderWithTransaction(req.body);
    res.status(201).json({ id: orderId });
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

export default {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
};
