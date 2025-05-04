const firebaseAdmin = require('firebase-admin');

// Initialize Firebase Admin SDK (ensure this is done once)
if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp();
} else {
  firebaseAdmin.app(); // if already initialized
}

const db = firebaseAdmin.firestore();
const usersRef = db.collection('users');

// Create user
const createUser = async (userData) => {
  try {
    const userRef = usersRef.doc(); // Create a new document reference
    await userRef.set(userData);  // Set user data to Firestore

    const userDoc = await userRef.get();  // Get the newly created user document
    return { id: userDoc.id, ...userDoc.data() };  // Return the created user with ID
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

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

// Set user role
const setRole = async (id, role) => {
  try {
    const userDoc = await usersRef.doc(id).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    // Update the role in Firestore
    await usersRef.doc(id).update({ role: role });

    const updatedUserDoc = await usersRef.doc(id).get();
    return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
  } catch (error) {
    throw new Error('Error setting role: ' + error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  setRole,
};
