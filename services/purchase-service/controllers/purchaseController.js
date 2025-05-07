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
    const purchaseData = req.body;

    // Validate input fields
    if (!purchaseData.items || purchaseData.items.length === 0) {
      return res.status(400).json({ message: 'Purchase must have at least one item' });
    }

    const purchaseId = await purchaseModel.create(purchaseData);
    res.status(201).json({ message: 'Purchase created successfully', purchaseId });
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update purchase status (e.g. from 'pending' to 'received')
const updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const purchase = await purchaseModel.getById(id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    await purchaseModel.update(id, { status });
    res.json({ message: 'Purchase status updated successfully' });
  } catch (error) {
    console.error('Error updating purchase status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a purchase
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await purchaseModel.getById(id);
    if (!purchase) {
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
