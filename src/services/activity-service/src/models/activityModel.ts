import admin from 'firebase-admin'
import { Activity } from '../types/Activity'
import { ActivityDTO } from '../dtos/activityDTO'

const db = admin.firestore()
const collection = db.collection('activities')

// CREATE
const createActivity = async (
  data: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = collection.doc()
  await docRef.set({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  return docRef.id
}

// READ ALL
const getAllActivities = async (): Promise<ActivityDTO[]> => {
  const snapshot = await collection.get()
  return snapshot.docs.map(doc =>
    ActivityDTO.fromFirestore(doc.id, doc.data() as Activity)
  )
}

// READ BY ID
const getActivityById = async (id: string): Promise<ActivityDTO> => {
  const doc = await collection.doc(id).get()
  if (!doc.exists) throw new Error('Activity not found')
  return ActivityDTO.fromFirestore(doc.id, doc.data() as Activity)
}

// READ BY RELATED ENTITY
const getActivitiesByRelatedTo = async (
  type: 'lead' | 'contact' | 'opportunity',
  id: string
): Promise<ActivityDTO[]> => {
  const snapshot = await collection
    .where('relatedTo.type', '==', type)
    .where('relatedTo.id', '==', id)
    .get()

  return snapshot.docs.map(doc =>
    ActivityDTO.fromFirestore(doc.id, doc.data() as Activity)
  )
}

// UPDATE
const updateActivity = async (
  id: string,
  data: Partial<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  return { message: 'Activity updated successfully' }
}

// DELETE
const deleteActivity = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete()
  return { message: 'Activity deleted successfully' }
}

export default {
  createActivity,
  getAllActivities,
  getActivityById,
  getActivitiesByRelatedTo,
  updateActivity,
  deleteActivity,
}
