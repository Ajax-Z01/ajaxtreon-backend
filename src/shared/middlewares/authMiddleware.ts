import { Request, Response, NextFunction } from 'express';
import admin from '../firebaseAdmin';

// Middleware: Authenticate user using Firebase ID Token
const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Authorization header missing or malformed:', authHeader);
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Store the user information in res.locals instead of req.user
    res.locals.user = {
      uid: decodedToken.uid,
      email: decodedToken.email ?? '',
      role: decodedToken.role ?? 'user',
    };  

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Authentication error:', error.message);
      res.status(401).json({ message: 'Unauthorized', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(401).json({ message: 'Unauthorized', error: 'Unknown error occurred' });
    }
  }
};

// Middleware: Authorize user with specific roles
const authorizeRoles = (...roles: string[]) => (req: Request, res: Response, next: NextFunction): void => {
  const userRole = res.locals.user?.role;

  if (!userRole || !roles.includes(userRole)) {
    res.status(403).json({ message: 'Forbidden: Insufficient role' });
    return;
  }

  next();
};

// Middleware: Only allow admin users
const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const userRole = res.locals.user?.role;

  if (!userRole) {
    res.status(403).json({ message: 'Missing role in token' });
    return;
  }

  if (userRole !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
    return;
  }

  next();
};

// Middleware: Only allow seller users
const authorizeSeller = (req: Request, res: Response, next: NextFunction): void => {
  const userRole = res.locals.user?.role;

  if (!userRole) {
    res.status(403).json({ message: 'Missing role in token' });
    return;
  }

  if (userRole !== 'seller') {
    res.status(403).json({ message: 'Forbidden: Seller access required' });
    return;
  }

  next();
};

export { authenticateUser, authorizeRoles, authorizeAdmin, authorizeSeller };
