import { Request, Response } from 'express';
import orderModel from '../models/orderModel';
import { OrderRequestBody } from '../types/order';

const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderModel.getOrders();
    res.status(200).json(orders); // Adding proper status code
  } catch (error: unknown) {
    // Consistent error handling
    handleError(error, res, 'Error getting orders');
  }
};

const addOrder = async (req: Request<{}, {}, OrderRequestBody>, res: Response): Promise<void> => {
  try {
    const orderId = await orderModel.addOrderWithTransaction(req.body);
    res.status(201).json({ id: orderId }); // Adding status code for created resources
  } catch (error: unknown) {
    // Consistent error handling
    handleError(error, res, 'Transaction failed');
  }
};

const updateOrder = async (req: Request<{ id: string }, {}, { status: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await orderModel.updateOrder(id, status);
    res.status(200).json({ message: 'Order status updated' }); // Added proper status code for success
  } catch (error: unknown) {
    // Consistent error handling
    handleError(error, res, 'Error updating order');
  }
};

const deleteOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await orderModel.deleteOrder(id);
    res.status(200).json({ message: 'Order soft-deleted successfully' }); // Added proper status code for success
  } catch (error: unknown) {
    // Consistent error handling
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
