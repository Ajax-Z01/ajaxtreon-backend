import { Seller } from '../types/seller';

class SellerDTO {
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
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(
    id: string,
    name: string,
    firebaseUid: string,
    createdAt: Date | null,
    updatedAt: Date | null,
    email?: string,
    phone?: string,
    address?: string,
    storeName?: string,
    storeUrl?: string,
    taxId?: string,
    productCategories?: string[],
    isVerified?: boolean
  ) {
    this.id = id;
    this.name = name;
    this.firebaseUid = firebaseUid;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.storeName = storeName;
    this.storeUrl = storeUrl;
    this.taxId = taxId;
    this.productCategories = productCategories;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromFirestore(id: string, data: Partial<Seller>): SellerDTO {
    const createdAt =
      data.createdAt instanceof Date
        ? data.createdAt
        : data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate()
          : null;

    const updatedAt =
      data.updatedAt instanceof Date
        ? data.updatedAt
        : data.updatedAt && typeof data.updatedAt.toDate === 'function'
          ? data.updatedAt.toDate()
          : null;

    return new SellerDTO(
      id,
      data.name ?? '',
      data.firebaseUid ?? '',
      createdAt,
      updatedAt,
      data.email,
      data.phone,
      data.address,
      data.storeName,
      data.storeUrl,
      data.taxId,
      data.productCategories,
      data.isVerified
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      storeName: this.storeName,
      storeUrl: this.storeUrl,
      taxId: this.taxId,
      productCategories: this.productCategories,
      isVerified: this.isVerified,
      firebaseUid: this.firebaseUid,
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }
}

export { SellerDTO };
