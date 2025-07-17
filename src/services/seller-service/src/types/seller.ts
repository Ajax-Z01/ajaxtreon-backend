import { Timestamp } from 'firebase-admin/firestore'

export interface Seller {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  firebaseUid: string;

  // Store Info
  storeName?: string;
  storeUrl?: string;
  slug?: string;
  storeDescription?: string;
  storeLogoUrl?: string;
  storeBannerUrl?: string;
  storeAnnouncement?: string;

  // Rating & Category
  ratingAverage?: number;
  ratingCount?: number;
  productCategories?: string[];

  // Identity
  taxId?: string;
  isVerified?: boolean;
  status?: 'active' | 'pending' | 'suspended' | 'rejected';

  // Contact
  website?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };

  // Location
  location?: {
    province?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };

  // Optional Policies
  returnPolicy?: string;
  shippingPolicy?: string;
  paymentMethods?: string[];

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
