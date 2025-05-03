const admin = require('firebase-admin');

// Register a new user
const registerUser = async (req, res) => {
  const { email, password, displayName, role } = req.body;

  if (!email || !password || !displayName || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Set custom claims (role)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Optionally store user in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to verify Firebase ID token
const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];
  
  if (!idToken) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;  // Attach user data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get user profile with role from custom claims
const getUserProfile = async (req, res) => {
  try {
    const decoded = req.user;
    const userRecord = await admin.auth().getUser(decoded.uid);

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      role: decoded.role || '',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authenticateUser,
  getUserProfile,
};
