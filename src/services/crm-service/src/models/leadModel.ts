import admin from 'firebase-admin'
import { Lead } from '../types/Lead'
import { LeadDTO } from '../dtos/leadDTO'

const db = admin.firestore()
const collection = db.collection('leads')

// CREATE
const createLead = async (
  data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
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
const getAllLeads = async (): Promise<LeadDTO[]> => {
  const snapshot = await collection.get()
  return snapshot.docs.map(doc => LeadDTO.fromFirestore(doc.id, doc.data() as Lead))
}

// READ BY ID
const getLeadById = async (id: string): Promise<LeadDTO> => {
  const doc = await collection.doc(id).get()
  if (!doc.exists) throw new Error('Lead not found')
  return LeadDTO.fromFirestore(doc.id, doc.data() as Lead)
}

// UPDATE
const updateLead = async (
  id: string,
  data: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  return { message: 'Lead updated successfully' }
}

// DELETE
const deleteLead = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete()
  return { message: 'Lead deleted successfully' }
}

export default {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
}
