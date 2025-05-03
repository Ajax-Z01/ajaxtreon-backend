const admin = require('../firebaseAdmin');

// Middleware: Authenticate user using Firebase ID Token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

// Middleware: Authorize user with specific roles
const authorizeRoles = (...roles) => (req, res, next) => {
  const userRole = req.user?.role;

  if (!roles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  }

  next();
};

// Middleware: Only allow admin users
const authorizeAdmin = (req, res, next) => {
  if (!req.user.role) {
    return res.status(403).json({ message: 'Missing role in token' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }

  next();
};


module.exports = {
  authenticateUser,
  authorizeRoles,
  authorizeAdmin,
};
