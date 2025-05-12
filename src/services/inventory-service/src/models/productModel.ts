import admin from '@shared/firebaseAdmin';
import ProductDTO from '../dtos/productDTO';
import { Product } from '../types/product';

const firestore = admin.firestore;
const db = firestore();

// Get all products
const getProducts = async (): Promise<Array<{ id: string } & Product>> => {
  const snapshot = await db.collection('products').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as { id: string } & Product));
};

// Add a new product
const addProduct = async (productData: Product): Promise<string> => {
  const product = new ProductDTO(
    productData.name,
    productData.price,
    productData.stock,
    productData.categoryId
  );
  const transformedProduct = ProductDTO.transformToFirestore(product);
  const docRef = await db.collection('products').add(transformedProduct);
  return docRef.id;
};

// Update an existing product
const updateProduct = async (id: string, productData: Product): Promise<void> => {
  const product = new ProductDTO(
    productData.name,
    productData.price,
    productData.stock,
    productData.categoryId
  );
  const transformedProduct = ProductDTO.transformToFirestore(product);
  await db.collection('products').doc(id).update(transformedProduct);
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
