import admin from 'firebase-admin'
import { Opportunity } from '../types/Opportunity'
import { OpportunityDTO } from '../dtos/opportunityDTO'

const db = admin.firestore()
const collection = db.collection('opportunities')

// CREATE
const createOpportunity = async (
  data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>
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
const getAllOpportunities = async (): Promise<OpportunityDTO[]> => {
  const snapshot = await collection.get()
  return snapshot.docs.map(doc => OpportunityDTO.fromFirestore(doc.id, doc.data() as Opportunity))
}

// READ BY ID
const getOpportunityById = async (id: string): Promise<OpportunityDTO> => {
  const doc = await collection.doc(id).get()
  if (!doc.exists) throw new Error('Opportunity not found')
  return OpportunityDTO.fromFirestore(doc.id, doc.data() as Opportunity)
}

// UPDATE
const updateOpportunity = async (
  id: string,
  data: Partial<Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  return { message: 'Opportunity updated successfully' }
}

// DELETE
const deleteOpportunity = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete()
  return { message: 'Opportunity deleted successfully' }
}

export default {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
}
