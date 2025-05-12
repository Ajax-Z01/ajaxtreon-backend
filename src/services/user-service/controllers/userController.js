const { getUserById, getAllUsers, updateUser, deleteUser } = require('../models/userModel');
const { validationResult } = require('express-validator');
const admin = require('@shared/firebaseAdmin');

// Create new user
const createUserController = async (req, res) => {
  const { email, password, name, role } = req.body;
  
  // Pastikan semua field yang diperlukan ada
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
  
    await admin.auth().setCustomUserClaims(userRecord.uid, { role });
  
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

// Get all users (Admin only)
const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user information (can be restricted to own account or admin)
const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await updateUser(id, { name, email, role });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUserInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await admin.auth().deleteUser(id);
    await deleteUser(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Set user role (Admin only)
const setUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // Role to set (admin, user, etc.)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!role || (role !== 'admin' && role !== 'user')) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  try {
    const userRecord = await admin.auth().getUser(id);
    if (!userRecord) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await admin.auth().setCustomUserClaims(id, { role });
    await admin.firestore().collection('users').doc(id).update({
      role: role
    });

    res.json({ message: `Custom claim '${role}' applied to UID: ${id}` });
  } catch (error) {
    console.error('Error setting user role:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createUserController,
  getAllUsersController,
  getUser,
  updateUserInfo,
  deleteUserInfo,
  setUserRole,
};
