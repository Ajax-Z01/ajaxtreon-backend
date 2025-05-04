const { validationResult } = require('express-validator');
const { getUserById, getAllUsers, updateUser, deleteUser, setRole, createUser } = require('../models/userModel');

// Create new user
const createUserController = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already exists
    const existingUser = await getUserById(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = await createUser({ name, email, password, role });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
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

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the role in Firestore
    const updatedUser = await setRole(id, role); // Function that updates the role in the database
    res.json({ message: 'Role updated successfully', user: updatedUser });
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
