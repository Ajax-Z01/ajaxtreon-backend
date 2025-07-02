import { Request, Response } from 'express';
import admin from '@shared/firebaseAdmin';
import axios from 'axios';

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

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

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

const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const role = 'customer';

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

    await admin.firestore().collection('customers').add({
      firebaseUid: userRecord.uid,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'Customer registered successfully',
      firebaseUid: userRecord.uid,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};

const registerSupplier = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const role = 'supplier';

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

    await admin.firestore().collection('suppliers').add({
      firebaseUid: userRecord.uid,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'Supplier registered successfully',
      firebaseUid: userRecord.uid,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};

const registerSeller = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const role = 'seller';

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

    await admin.firestore().collection('sellers').add({
      firebaseUid: userRecord.uid,
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'Seller registered successfully',
      firebaseUid: userRecord.uid,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const firebaseApiKey = process.env.FIREBASE_API_KEY;
    if (!firebaseApiKey) throw new Error('FIREBASE_API_KEY is missing in env');

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { idToken } = response.data;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await admin.firestore().collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      res.status(404).json({ message: 'User data not found' });
      return;
    }

    res.cookie('auth_token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: 'lax',
    });

    res.status(200).json({
      token: idToken,
      user: {
        uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Login error:', error?.response?.data || error.message);
    const message = error?.response?.data?.error?.message || 'Login failed';
    res.status(401).json({ message });
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error: unknown) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};


const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: Missing token' });
      return;
    }

    const idToken = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (!decodedToken) {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }

    const uid = decodedToken.uid;
    const role = decodedToken.role || null;

    const userDoc = await admin.firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ message: 'User data not found' });
      return;
    }

    const userData = userDoc.data();

    res.status(200).json({
      user: {
        uid,
        email: userData?.email || null,
        name: userData?.name || null,
        role,
      },
    });
  } catch (error: unknown) {
    console.error('Error in /api/auth/me:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default { registerUser, registerCustomer, registerSupplier, registerSeller, login, logout, me };
