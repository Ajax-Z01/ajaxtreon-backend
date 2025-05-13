import { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, setUserRoleInDb } from '../models/userModel';

// Create new user
const createUserController = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password || !name || !role) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const user = await createUser(email, password, name, role);
    res.status(201).json({ message: 'User registered successfully', uid: user.uid });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get all users (Admin only)
const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Get user by ID
const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Update user information
const updateUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const updatedUser = await updateUser(id, { name, email, role });
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Delete user
const deleteUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

// Set user role
const setUserRole = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || (role !== 'admin' && role !== 'user')) {
    res.status(400).json({ message: 'Invalid role provided' });
    return;
  }

  try {
    await setUserRoleInDb(id, role);
    res.json({ message: `Custom claim '${role}' applied to UID: ${id}` });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export default {
  createUserController,
  getAllUsersController,
  getUser,
  updateUserInfo,
  deleteUserInfo,
  setUserRole,
};
