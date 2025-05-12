import { Request, Response } from 'express';
import admin from '@shared/firebaseAdmin';

// Register a new user
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, role }: { email: string; password: string; name: string; role: string } = req.body;

  if (!email || !password || !name || !role) {
    res.status(400).json({ message: 'All fields are required' });
    return;
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Get user profile with role from custom claims
const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const decoded = req.user;

    if (!decoded) {
      res.status(400).json({ message: 'User not authenticated' });
      return;
    }

    const userRecord = await admin.auth().getUser(decoded.uid);

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || '',
      role: decoded.role || '',
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export default { registerUser, getUserProfile };
