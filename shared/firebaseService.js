const admin = require('firebase-admin');

// Function to verify Firebase ID token
const verifyIdToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Function to get user role from Firebase Auth
const getUserRole = async (uid) => {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.role || 'user';
  } catch (error) {
    throw new Error('Failed to get user role');
  }
};

module.exports = {
  verifyIdToken,
  getUserRole,
};
