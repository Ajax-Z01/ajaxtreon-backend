import admin from '@shared/firebaseAdmin'; // Firebase Admin SDK
import { UserData, UpdateUserData } from '../types/user';

// Create user in Firebase Authentication and Firestore
const createUser = async (email: string, password: string, name: string, role: string) => {
  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Set custom claims (role) for the user
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Store user data in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid }; // Return UID of the created user
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    }
    throw new Error('An unknown error occurred while creating the user');
  }
};

// Get all users from Firestore
const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error getting all users: ' + error.message);
    }
    throw new Error('An unknown error occurred while getting all users');
  }
};

// Get a user by ID from Firestore
const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const userDoc = await admin.firestore().collection('users').doc(id).get();
    if (!userDoc.exists) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() } as UserData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error getting user by ID: ' + error.message);
    }
    throw new Error('An unknown error occurred while getting the user by ID');
  }
};

// Update a user's information
const updateUser = async (id: string, updateData: UpdateUserData): Promise<UserData> => {
  try {
    await admin.firestore().collection('users').doc(id).update(updateData as Record<string, any>);

    const updatedUserDoc = await admin.firestore().collection('users').doc(id).get();
    return { id: updatedUserDoc.id, ...updatedUserDoc.data() } as UserData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error updating user: ' + error.message);
    }
    throw new Error('An unknown error occurred while updating the user');
  }
};


// Delete a user from Firestore and Firebase Authentication
const deleteUser = async (id: string): Promise<void> => {
  try {
    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(id);

    // Delete user from Firestore
    await admin.firestore().collection('users').doc(id).delete();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error deleting user: ' + error.message);
    }
    throw new Error('An unknown error occurred while deleting the user');
  }
};

// Set the role of a user (admin only)
const setUserRoleInDb = async (id: string, role: string): Promise<void> => {
  try {
    // Set custom claims (role) for the user
    await admin.auth().setCustomUserClaims(id, { role });

    // Update role in Firestore
    await admin.firestore().collection('users').doc(id).update({ role });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error setting user role: ' + error.message);
    }
    throw new Error('An unknown error occurred while setting the user role');
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  setUserRoleInDb,
};
