import admin from 'firebase-admin'
import { CRMUser as User } from '../types/User'
import { UserDTO } from '../dtos/userDTO'

const db = admin.firestore()
const collection = db.collection('crmUsers')

// CREATE
const createUser = async (
  data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'lastActivityAt'>
): Promise<string> => {
  const docRef = collection.doc()
  await docRef.set({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: null,
    lastLoginAt: null,
    lastActivityAt: null,
  })
  return docRef.id
}

// READ ALL
const getAllUsers = async (): Promise<UserDTO[]> => {
  const snapshot = await collection.get()
  return snapshot.docs.map(doc => UserDTO.fromFirestore(doc.id, doc.data() as User))
}

// READ BY ID
const getUserById = async (id: string): Promise<UserDTO> => {
  const doc = await collection.doc(id).get()
  if (!doc.exists) throw new Error('User not found')
  return UserDTO.fromFirestore(doc.id, doc.data() as User)
}

// READ BY EMAIL
const getUserByEmail = async (email: string): Promise<UserDTO | null> => {
  const snapshot = await collection.where('email', '==', email).limit(1).get()
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return UserDTO.fromFirestore(doc.id, doc.data() as User)
}

// UPDATE
const updateUser = async (
  id: string,
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'lastActivityAt'>>
): Promise<{ message: string }> => {
  await collection.doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  return { message: 'User updated successfully' }
}

// DELETE
const deleteUser = async (id: string): Promise<{ message: string }> => {
  await collection.doc(id).delete()
  return { message: 'User deleted successfully' }
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
}
