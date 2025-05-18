import type { UserData } from '../types/user';
import type { Purchase } from '../types/purchase';

class SupplierReportDTO {
  supplierId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;

  totalPurchases: number;
  totalQuantityPurchased: number;
  lastPurchaseDate?: Date;

  constructor(
    supplierId: string,
    name: string,
    isActive: boolean,
    createdAt: Date,
    totalPurchases: number,
    totalQuantityPurchased: number,
    lastPurchaseDate?: Date,
    email?: string,
    phone?: string,
    address?: string,
    updatedAt?: Date,
    role?: string,
  ) {
    this.supplierId = supplierId;
    this.name = name;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.totalPurchases = totalPurchases;
    this.totalQuantityPurchased = totalQuantityPurchased;
    this.lastPurchaseDate = lastPurchaseDate;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.updatedAt = updatedAt;
    this.role = role;
  }

  static fromData(supplier: UserData, purchases: Purchase[]): SupplierReportDTO {
    const totalPurchases = purchases.length;
    const totalQuantityPurchased = purchases.reduce((sum, p) => sum + p.quantity, 0);

    const lastPurchaseDate = purchases
      .map(p => (p.createdAt instanceof Date ? p.createdAt : p.createdAt.toDate()))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return new SupplierReportDTO(
      supplier.id,
      supplier.name,
      supplier.isActive,
      supplier.createdAt.toDate(),
      totalPurchases,
      totalQuantityPurchased,
      lastPurchaseDate,
      supplier.email,
      supplier.phone,
      supplier.address,
      supplier.updatedAt?.toDate(),
      supplier.role,
    );
  }
}

export { SupplierReportDTO };
