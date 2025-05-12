import admin from '@shared/firebaseAdmin';
import { Category } from '../types/category';

const firestore = admin.firestore;
const db = firestore();

// Get all categories
const getAllCategories = async (): Promise<Array<{ id: string } & Category>> => {
  const snapshot = await db.collection('categories').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string } & Category));
};

// Add a new category
const addCategory = async (categoryData: Category): Promise<string> => {
  const docRef = await db.collection('categories').add(categoryData);
  return docRef.id;
};

// Update a category
const updateCategory = async (id: string, updatedData: Partial<Category>): Promise<void> => {
  await db.collection('categories').doc(id).update(updatedData);
};

// Delete a category
const deleteCategory = async (id: string): Promise<void> => {
  await db.collection('categories').doc(id).delete();
};

export default {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
