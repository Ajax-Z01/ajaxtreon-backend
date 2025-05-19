import admin from 'firebase-admin';
import { Supplier } from '../types/supplier';
import { SupplierDTO } from '../dtos/supplierDTO';

const db = admin.firestore();
const collection = db.collection('suppliers');

// CREATE
const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const dto = new SupplierDTO(
    '',
    supplierData.name,
    new Date(),
    new Date(),
    supplierData.email,
    supplierData.phone,
    supplierData.address,
    supplierData.companyName,
    supplierData.contactPersons,
    supplierData.taxId,
    supplierData.paymentTerm,
    supplierData.productsSupplied
  );

  const docRef = collection.doc();
  await docRef.set({
    ...dto,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: null,
  });

  return docRef.id;
};

// READ
const getAllSuppliers = async (): Promise<SupplierDTO[]> => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => SupplierDTO.fromFirestore(doc.id, doc.data() as Supplier));
};

const getSupplierById = async (id: string): Promise<SupplierDTO> => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) throw new Error('Supplier not found');
  const data = doc.data();
  if (!data) throw new Error('Supplier data is undefined');
  return SupplierDTO.fromFirestore(doc.id, data as Supplier);
};

// UPDATE
const updateSupplier = async (
  id: string,
  data: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { message: 'Supplier updated successfully' };
};

// DELETE
const deleteSupplier = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete();
  return { message: 'Supplier deleted successfully' };
};

export default {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
