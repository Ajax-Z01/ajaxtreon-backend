const firebaseAdmin = require('@shared/firebaseAdmin'); // Import Firebase Admin SDK

// Initialize Firebase Admin SDK (ensure this is done once)
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp();
} else {
  firebaseAdmin.app(); // if already initialized
}

const db = firebaseAdmin.firestore();
const usersRef = db.collection('users');

// Get all users
const getAllUsers = async () => {
  try {
    const snapshot = await usersRef.get();
    if (snapshot.empty) {
      return [];  // Return an empty array if no users exist
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Error getting all users: ' + error.message);
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const userDoc = await usersRef.doc(id).get();
    if (!userDoc.exists) {
      return null;  // Return null if user does not exist
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    throw new Error('Error getting user by ID: ' + error.message);
  }
};

// Update user
const updateUser = async (id, updateData) => {
  try {
    await usersRef.doc(id).update(updateData);
    const updatedUserDoc = await usersRef.doc(id).get();
    return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
  }
};

// Delete user
const deleteUser = async (id) => {
  try {
    await usersRef.doc(id).delete();
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

module.exports = {
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
};
