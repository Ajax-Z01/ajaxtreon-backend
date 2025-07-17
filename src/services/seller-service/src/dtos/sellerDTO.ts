import { Seller } from '../types/seller';
import { Timestamp } from 'firebase-admin/firestore';

class SellerDTO {
  // semua properti sama seperti sebelumnya ...
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

  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;

  constructor(data: Partial<Seller> & { id: string }) {
    this.id = data.id;
    this.name = data.name ?? '';
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.firebaseUid = data.firebaseUid ?? '';

    this.storeName = data.storeName;
    this.storeUrl = data.storeUrl;
    this.slug = data.slug;
    this.storeDescription = data.storeDescription;
    this.storeLogoUrl = data.storeLogoUrl;
    this.storeBannerUrl = data.storeBannerUrl;
    this.storeAnnouncement = data.storeAnnouncement;

    this.ratingAverage = data.ratingAverage;
    this.ratingCount = data.ratingCount;
    this.productCategories = data.productCategories;

    this.taxId = data.taxId;
    this.isVerified = data.isVerified;
    this.status = data.status;

    this.website = data.website;
    this.socialMediaLinks = data.socialMediaLinks;

    this.location = data.location;

    this.returnPolicy = data.returnPolicy;
    this.shippingPolicy = data.shippingPolicy;
    this.paymentMethods = data.paymentMethods;

    this.createdAt = data.createdAt ?? null;
    this.updatedAt = data.updatedAt ?? null;
  }

  static fromRawInput(input: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>): SellerDTO {
    return new SellerDTO({
      id: '',
      ...input,
      createdAt: Timestamp.now(),
      updatedAt: undefined,
    });
  }

  static fromFirestore(id: string, data: Partial<Seller>): SellerDTO {
    return new SellerDTO({ ...data, id });
  }

  toFirestore(): object {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      firebaseUid: this.firebaseUid,

      storeName: this.storeName,
      storeUrl: this.storeUrl,
      slug: this.slug,
      storeDescription: this.storeDescription,
      storeLogoUrl: this.storeLogoUrl,
      storeBannerUrl: this.storeBannerUrl,
      storeAnnouncement: this.storeAnnouncement,

      ratingAverage: this.ratingAverage,
      ratingCount: this.ratingCount,
      productCategories: this.productCategories,

      taxId: this.taxId,
      isVerified: this.isVerified,
      status: this.status,

      website: this.website,
      socialMediaLinks: this.socialMediaLinks,

      location: this.location,

      returnPolicy: this.returnPolicy,
      shippingPolicy: this.shippingPolicy,
      paymentMethods: this.paymentMethods,

      createdAt: this.createdAt ?? Timestamp.now(),
      updatedAt: this.updatedAt ?? null,
    };
  }
}

export { SellerDTO };
