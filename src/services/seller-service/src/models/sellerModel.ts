import admin from 'firebase-admin';
import { Seller } from '../types/seller';
import { SellerDTO } from '../dtos/sellerDTO';

const db = admin.firestore();
const collection = db.collection('sellers');

// CREATE
const createSeller = async (
  sellerData: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const dto = SellerDTO.fromRawInput(sellerData);

  const docRef = collection.doc();
  await docRef.set({
    ...dto.toFirestore(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: null,
  });

  return docRef.id;
};

// READ ALL
const getAllSellers = async (): Promise<SellerDTO[]> => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => SellerDTO.fromFirestore(doc.id, doc.data() as Seller));
};

// READ BY ID
const getSellerById = async (id: string): Promise<SellerDTO> => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) throw new Error('Seller not found');
  return SellerDTO.fromFirestore(doc.id, doc.data() as Seller);
};

// READ BY FIREBASE UID
const getSellerByFirebaseUid = async (
  firebaseUid: string
): Promise<{ id: string; name: string }> => {
  const snapshot = await collection.where('firebaseUid', '==', firebaseUid).limit(1).get();
  if (snapshot.empty) throw new Error('Seller with this Firebase UID not found');

  const doc = snapshot.docs[0];
  const data = doc.data() as Seller;

  return {
    id: doc.id,
    name: data.name,
  };
};

// UPDATE
const updateSeller = async (
  id: string,
  data: Partial<Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { message: 'Seller updated successfully' };
};

// DELETE
const deleteSeller = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete();
  return { message: 'Seller deleted successfully' };
};

export default {
  createSeller,
  getAllSellers,
  getSellerById,
  getSellerByFirebaseUid,
  updateSeller,
  deleteSeller,
};
