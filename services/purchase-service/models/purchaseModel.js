const { db } = require('firebase-admin').firestore();

const COLLECTION_NAME = 'purchases'

const create = async (purchaseData) => {
    const now = new Date()
  
    const newPurchase = {
      ...purchaseData,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    }
  
    const docRef = await db.collection(COLLECTION_NAME).add(newPurchase)
    await docRef.update({ id: docRef.id })
    return docRef.id
}

const getAll = async () => {
  const snapshot = await db.collection(COLLECTION_NAME).get()
  return snapshot.docs.map(doc => doc.data())
}

const getById = async (id) => {
  const doc = await db.collection(COLLECTION_NAME).doc(id).get()
  if (!doc.exists) return null
  return doc.data()
}

const update = async (id, updateData) => {
  updateData.updatedAt = new Date()
  await db.collection(COLLECTION_NAME).doc(id).update(updateData)
}

const remove = async (id) => {
  await db.collection(COLLECTION_NAME).doc(id).delete()
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
}
