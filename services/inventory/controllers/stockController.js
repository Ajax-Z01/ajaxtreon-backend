const db = require('firebase-admin').firestore();

// Log stock change
const logStockChange = async (productId, changeType, quantity, note) => {
  try {
    const timestamp = new Date();
    await db.collection('stock_changes').add({
      product_id: productId,
      change_type: changeType,
      quantity: quantity,
      timestamp: timestamp,
      note: note || ''
    });
  } catch (error) {
    console.error('Error logging stock change:', error);
  }
};

// Add stock to a product (Increase)
const addStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, note } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  try {
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = product.data();
    if (!productData || typeof productData.stock !== 'number') {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const updatedStock = productData.stock + quantity;
    await productRef.update({ stock: updatedStock });

    // Log the stock change
    await logStockChange(id, 'add', quantity, note);

    res.json({ message: 'Stock added successfully', stock: updatedStock });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ message: error.message });
  }
};

// Subtract stock from a product (Decrease)
const subtractStock = async (req, res) => {
  const { id } = req.params;
  const { quantity, note } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  try {
    const productRef = db.collection('products').doc(id);
    const product = await productRef.get();

    if (!product.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = product.data();
    if (!productData || typeof productData.stock !== 'number') {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const updatedStock = productData.stock - quantity;
    if (updatedStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    await productRef.update({ stock: updatedStock });

    // Log the stock change
    await logStockChange(id, 'subtract', quantity, note);

    res.json({ message: 'Stock subtracted successfully', stock: updatedStock });
  } catch (error) {
    console.error('Error subtracting stock:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get stock change history for a product
const getStockHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const snapshot = await db.collection('stock_changes')
      .where('product_id', '==', id)
      .orderBy('timestamp', 'desc')
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No stock change history found' });
    }

    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(history);
  } catch (error) {
    console.error('Error getting stock change history:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addStock,
  subtractStock,
  getStockHistory,
};
