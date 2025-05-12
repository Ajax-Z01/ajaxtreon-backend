import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import categoryModel from '../models/categoryModel';

// Get all categories
const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add new category
const addCategory = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const newCategory = req.body;
    const id = await categoryModel.addCategory(newCategory);
    res.status(201).json({ id });
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { id } = req.params;
    const updatedCategory = req.body;
    await categoryModel.updateCategory(id, updatedCategory);
    res.json({ message: 'Category updated' });
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete category
const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await categoryModel.deleteCategory(id);
    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};