import admin from 'firebase-admin';
import { Customer } from '../types/customer';
import { CustomerDTO } from '../dtos/customerDTO';

const db = admin.firestore();
const collection = db.collection('customers');

// CREATE
const createCustomer = async (
  customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const dto = new CustomerDTO(
    '',
    customerData.firebaseUid,
    customerData.name,
    new Date(),
    new Date(),
    customerData.email,
    customerData.phone,
    customerData.address,
    customerData.billingAddress,
    customerData.contactPersons,
    customerData.loyaltyMemberId,
    customerData.notes
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
const getAllCustomers = async (): Promise<CustomerDTO[]> => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => CustomerDTO.fromFirestore(doc.id, doc.data() as Customer));
};

// READ by ID
const getCustomerById = async (id: string): Promise<CustomerDTO> => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) throw new Error('Customer not found');
  const data = doc.data();
  if (!data) throw new Error('Customer data is undefined');
  return CustomerDTO.fromFirestore(doc.id, data as Customer);
};

const getCustomerByFirebaseUid = async (uid: string): Promise<CustomerDTO> => {
  const snapshot = await collection.where('firebaseUid', '==', uid).limit(1).get();

  if (snapshot.empty) {
    throw new Error('Customer not found');
  }

  const doc = snapshot.docs[0];
  return CustomerDTO.fromFirestore(doc.id, doc.data() as Customer);
};

// UPDATE
const updateCustomer = async (
  id: string,
  data: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { message: 'Customer updated successfully' };
};

// DELETE
const deleteCustomer = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete();
  return { message: 'Customer deleted successfully' };
};

export default {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByFirebaseUid,
  updateCustomer,
  deleteCustomer,
};
