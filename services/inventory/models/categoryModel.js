const db = require('firebase-admin').firestore();

const getAllCategories = async () => {
  const snapshot = await db.collection('categories').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addCategory = async (categoryData) => {
  const docRef = await db.collection('categories').add(categoryData);
  return docRef.id;
};

const updateCategory = async (id, updatedData) => {
  await db.collection('categories').doc(id).update(updatedData);
};

const deleteCategory = async (id) => {
  await db.collection('categories').doc(id).delete();
};

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
