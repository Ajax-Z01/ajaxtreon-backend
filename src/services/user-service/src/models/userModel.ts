import admin from '@shared/firebaseAdmin';
import { UserDTO } from '../dtos/userDTO';
import { UserData, UpdateUserData, UserRole } from '../types/User';

// Create user in Firebase Authentication and Firestore
const createUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: UserRole, 
  phone?: string, 
  address?: string
) => {
  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: name });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    const createdAt = admin.firestore.FieldValue.serverTimestamp();

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      name,
      role,
      isActive: true,
      createdAt,
      phone: phone || null,
      address: address || null,
    });

    return { uid: userRecord.uid };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    }
    throw new Error('An unknown error occurred while creating the user');
  }
};

// Get all users from Firestore
const getAllUsers = async (): Promise<UserDTO[]> => {
  try {
    const snapshot = await admin.firestore().collection('users').get();
    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => {
      const data = doc.data() as UserData;
      return UserDTO.fromFirestore(doc.id, data);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error getting all users: ' + error.message);
    }
    throw new Error('An unknown error occurred while getting all users');
  }
};


// Get a user by ID from Firestore
const getUserById = async (id: string): Promise<UserDTO | null> => {
  try {
    const userDoc = await admin.firestore().collection('users').doc(id).get();
    const data = userDoc.data();

    if (!userDoc.exists || !data) {
      return null;
    }

    return UserDTO.fromFirestore(userDoc.id, data as UserData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error getting user by ID: ' + error.message);
    }
    throw new Error('An unknown error occurred while getting the user by ID');
  }
};

const updateUser = async (id: string, updateData: UpdateUserData): Promise<UserDTO> => {
  try {
    const dataToUpdate = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection('users').doc(id).update(dataToUpdate);

    const updatedDoc = await admin.firestore().collection('users').doc(id).get();
    const data = updatedDoc.data();

    if (!updatedDoc.exists || !data) {
      throw new Error('User not found after update');
    }

    return UserDTO.fromFirestore(updatedDoc.id, data as UserData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error updating user: ' + error.message);
    }
    throw new Error('An unknown error occurred while updating the user');
  }
};

// Delete a user
const deleteUser = async (id: string): Promise<void> => {
  try {
    await admin.auth().deleteUser(id);
    await admin.firestore().collection('users').doc(id).delete();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error deleting user: ' + error.message);
    }
    throw new Error('An unknown error occurred while deleting the user');
  }
};

// Set the role of a user
const setUserRoleInDb = async (id: string, role: UserRole): Promise<void> => {
  try {
    await admin.auth().setCustomUserClaims(id, { role });
    await admin.firestore().collection('users').doc(id).update({ role });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error setting user role: ' + error.message);
    }
    throw new Error('An unknown error occurred while setting the user role');
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  setUserRoleInDb,
};
