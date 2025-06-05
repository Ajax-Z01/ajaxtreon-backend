import { Timestamp } from 'firebase-admin/firestore';

export interface Seller {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  storeName?: string;
  storeUrl?: string;
  taxId?: string;
  productCategories?: string[];
  isVerified?: boolean;
  firebaseUid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
