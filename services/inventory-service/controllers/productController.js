const { validationResult } = require('express-validator');
const productModel = require('../models/productModel');
const ProductDTO = require('../dtos/productDTO');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await productModel.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProductData = req.body;

    if (!ProductDTO.validate(newProductData)) {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const newProduct = new ProductDTO(newProductData.name, newProductData.price, newProductData.stock, newProductData.categoryId);
    const transformedProduct = ProductDTO.transformToFirestore(newProduct);

    const productId = await productModel.addProduct(transformedProduct);
    res.status(201).json({ id: productId });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updatedProductData = req.body;

    if (!ProductDTO.validate(updatedProductData)) {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const updatedProduct = new ProductDTO(updatedProductData.name, updatedProductData.price, updatedProductData.stock, updatedProductData.categoryId);
    const transformedProduct = ProductDTO.transformToFirestore(updatedProduct);

    await productModel.updateProduct(id, transformedProduct);
    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.deleteProduct(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
