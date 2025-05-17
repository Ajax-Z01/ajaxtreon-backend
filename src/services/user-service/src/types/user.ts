export type UserRole = 'admin' | 'user' | 'staff' | 'manager'

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  profilePictureUrl?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  lastLoginAt?: FirebaseFirestore.Timestamp;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  isActive?: boolean;
  profilePictureUrl?: string;
  updatedAt?: FirebaseFirestore.Timestamp;
}
