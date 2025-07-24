import admin from '@shared/firebaseAdmin';
import CategoryDTO from '../dtos/categoryDTO';
import { Category } from '../types/Category';

const firestore = admin.firestore;
const db = firestore();

// Get all categories
const getAllCategories = async (): Promise<Array<{ id: string } & Category>> => {
  const snapshot = await db.collection('categories').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const categoryDTO = CategoryDTO.transformFromFirestore(data);
    return { id: doc.id, ...categoryDTO } as { id: string } & Category;
  });
};

// Add a new category
const addCategory = async (categoryData: Category & { createdBy: string }): Promise<string> => {
  const categoryDTO = new CategoryDTO(
    categoryData.name,
    categoryData.description,
    categoryData.createdBy,
    new Date()
  );

  if (!CategoryDTO.validate(categoryDTO)) {
    throw new Error('Invalid category data');
  }

  const transformedData = CategoryDTO.transformToFirestore(categoryDTO);
  const docRef = await db.collection('categories').add(transformedData);
  return docRef.id;
};

// Update a category
const updateCategory = async (id: string, updatedData: Partial<Category>): Promise<void> => {
  const updatePayload = {
    ...updatedData,
    updatedAt: new Date(),
  };

  await db.collection('categories').doc(id).update(updatePayload);
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
