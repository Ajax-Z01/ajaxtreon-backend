import admin from '@shared/firebaseAdmin';
import ProductDTO from '../dtos/productDTO';
import type { Product } from '../types/product';

const firestore = admin.firestore;
const db = firestore();

// Get all products
const getProducts = async (): Promise<Array<{ id: string } & Product>> => {
  const snapshot = await db.collection('products').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string } & Product));
};

// Add a new product
const addProduct = async (productData: Product & { createdBy: string }): Promise<string> => {
  const now = new Date();
  const product = new ProductDTO(
    productData.name,
    productData.price,
    productData.stock,
    productData.categoryId,
    productData.createdBy,
    productData.description,
    productData.imageUrl,
    productData.sku,
    productData.isActive ?? true,
    now,
    undefined
  );
  const transformedProduct = ProductDTO.transformToFirestore(product);
  const docRef = await db.collection('products').add(transformedProduct);
  return docRef.id;
};

// Update an existing product
const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
  const docRef = db.collection('products').doc(id);
  const docSnapshot = await docRef.get();

  if (!docSnapshot.exists) {
    throw new Error('Product not found');
  }

  const existingData = docSnapshot.data()!;
  const updatedAt = new Date();

  const product = new ProductDTO(
    productData.name ?? existingData.name,
    productData.price ?? existingData.price,
    productData.stock ?? existingData.stock,
    productData.categoryId ?? existingData.categoryId,
    existingData.createdBy,
    productData.description ?? existingData.description,
    productData.imageUrl ?? existingData.imageUrl,
    productData.sku ?? existingData.sku,
    productData.isActive ?? existingData.isActive ?? true,
    existingData.createdAt?.toDate ? existingData.createdAt.toDate() : existingData.createdAt,
    updatedAt
  );

  const transformedProduct = ProductDTO.transformToFirestore(product);
  await docRef.update(transformedProduct);
};

// Delete a product
const deleteProduct = async (id: string): Promise<void> => {
  await db.collection('products').doc(id).delete();
};

export default {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
