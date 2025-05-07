const admin = require('@shared/firebaseAdmin');

// Register a new user
const registerUser = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Set custom claims (role)
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    // Optionally store user in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      name: userRecord.name || '',
      role: decoded.role || '',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
};
