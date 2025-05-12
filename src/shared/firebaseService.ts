import admin from './firebaseAdmin';

// Function to verify Firebase ID token
const verifyIdToken = async (token: string): Promise<any> => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Function to get user role from Firebase Auth
const getUserRole = async (uid: string): Promise<string> => {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.role || 'user';
  } catch (error) {
    throw new Error('Failed to get user role');
  }
};

export { verifyIdToken, getUserRole };
