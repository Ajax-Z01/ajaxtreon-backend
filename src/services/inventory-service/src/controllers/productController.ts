import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import productModel from '../models/productModel';

// Get all products
const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await productModel.getProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    res.json(product);
  } catch (error: any) {
    console.error('Error fetching product by ID:', error);
    res.status(404).json({ message: error.message });
  }
};

// Add a new product
const addProduct = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const newProductData = req.body;

    // Validate the product data before sending it to the model
    if (!newProductData.name || !newProductData.price || !newProductData.stock || !newProductData.categoryId) {
      res.status(400).json({ message: 'Invalid product data' });
      return;
    }

    const productId = await productModel.addProduct(newProductData);
    res.status(201).json({ id: productId });
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a product
const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { id } = req.params;
    const updatedProductData = req.body;

    // Validate the product data before sending it to the model
    if (!updatedProductData.name || !updatedProductData.price || !updatedProductData.stock || !updatedProductData.categoryId) {
      res.status(400).json({ message: 'Invalid product data' });
      return;
    }

    await productModel.updateProduct(id, updatedProductData);
    res.json({ message: 'Product updated' });
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await productModel.deleteProduct(id);
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
