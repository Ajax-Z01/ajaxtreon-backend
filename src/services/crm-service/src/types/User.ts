import { Timestamp } from 'firebase-admin/firestore';

export type CRMUserRole = 'admin' | 'staff' | 'manager' | 'sales' | 'marketing' | 'support';

export interface CRMUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: CRMUserRole;
  isActive: boolean;
  profilePictureUrl?: string;
  department?: string;
  assignedLeads?: string[];
  notes?: string;
  permissions?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
  lastActivityAt?: Timestamp;
}
