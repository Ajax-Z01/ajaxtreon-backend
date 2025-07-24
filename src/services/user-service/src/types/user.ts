import { Timestamp } from 'firebase-admin/firestore';

export type UserRole = 'admin' | 'user' | 'staff' | 'manager' | 'customer' | 'supplier' | 'seller';

export interface UserData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  profilePictureUrl?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: UserRole;
  isActive?: boolean;
  profilePictureUrl?: string;
  updatedAt?: Timestamp;
}
