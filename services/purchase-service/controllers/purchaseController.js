const purchaseModel = require('../models/purchaseModel');

// Get all purchases
const getPurchases = async (req, res) => {
  try {
    const purchases = await purchaseModel.getAll();
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get purchase by ID
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await purchaseModel.getById(id);

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new purchase
const addPurchase = async (req, res) => {
  try {
    const purchaseId = await purchaseModel.addPurchaseWithTransaction(req.body);
    res.status(201).json({ message: 'Purchase created successfully', purchaseId });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update purchase status only
const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const purchase = await purchaseModel.getById(id);
    if (!purchase || purchase.isDeleted) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await purchaseModel.update(id, { status });
    res.json({ message: 'Purchase status updated successfully' });
  } catch (error) {
    console.error('Error updating purchase status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a purchase
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await purchaseModel.getById(id);
    if (!purchase || purchase.isDeleted) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await purchaseModel.remove(id);
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPurchases,
  getPurchaseById,
  addPurchase,
  updatePurchaseStatus,
  deletePurchase
};
