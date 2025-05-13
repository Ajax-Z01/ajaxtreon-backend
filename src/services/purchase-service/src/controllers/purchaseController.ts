import { Request, Response } from 'express';
import purchaseModel from '../models/purchaseModel';

// Get all purchases
const getPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = await purchaseModel.getAll();
    res.json(purchases);
  } catch (error: any) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get purchase by ID
const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const purchase = await purchaseModel.getById(id);

    if (!purchase) {
      res.status(404).json({ message: 'Purchase not found' });
      return;
    }

    res.json(purchase);
  } catch (error: any) {
    console.error('Error fetching purchase by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new purchase
const addPurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchaseId = await purchaseModel.addPurchaseWithTransaction(req.body);
    res.status(201).json({ message: 'Purchase created successfully', purchaseId });
  } catch (error: any) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update purchase status only
const updatePurchaseStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const purchase = await purchaseModel.getById(id);
    if (!purchase || purchase.isDeleted) {
      res.status(404).json({ message: 'Purchase not found' });
      return;
    }

    await purchaseModel.update(id, { status });
    res.json({ message: 'Purchase status updated successfully' });
  } catch (error: any) {
    console.error('Error updating purchase status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a purchase
const deletePurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const purchase = await purchaseModel.getById(id);
    if (!purchase || purchase.isDeleted) {
      res.status(404).json({ message: 'Purchase not found' });
      return;
    }

    await purchaseModel.remove(id);
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getPurchases,
  getPurchaseById,
  addPurchase,
  updatePurchaseStatus,
  deletePurchase,
};
