import admin from 'firebase-admin'
import { Contact } from '../types/Contact'
import { ContactDTO } from '../dtos/contactDTO'

const db = admin.firestore()
const collection = db.collection('contacts')

// CREATE
const createContact = async (
  data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = collection.doc()
  await docRef.set({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: null,
  })
  return docRef.id
}

// READ ALL
const getAllContacts = async (): Promise<ContactDTO[]> => {
  const snapshot = await collection.get()
  return snapshot.docs.map(doc => ContactDTO.fromFirestore(doc.id, doc.data() as Contact))
}

// READ BY ID
const getContactById = async (id: string): Promise<ContactDTO> => {
  const doc = await collection.doc(id).get()
  if (!doc.exists) throw new Error('Contact not found')
  return ContactDTO.fromFirestore(doc.id, doc.data() as Contact)
}

// READ BY LEAD ID
const getContactsByLeadId = async (leadId: string): Promise<ContactDTO[]> => {
  const snapshot = await collection.where('leadId', '==', leadId).get()
  return snapshot.docs.map(doc => ContactDTO.fromFirestore(doc.id, doc.data() as Contact))
}

// UPDATE
const updateContact = async (
  id: string,
  data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  return { message: 'Contact updated successfully' }
}

// DELETE
const deleteContact = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete()
  return { message: 'Contact deleted successfully' }
}

export default {
  createContact,
  getAllContacts,
  getContactById,
  getContactsByLeadId,
  updateContact,
  deleteContact,
}
