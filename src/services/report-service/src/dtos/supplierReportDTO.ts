import { Timestamp } from 'firebase-admin/firestore';
import type { Supplier } from '../types/Supplier';
import type { Purchase } from '../types/Purchase';

class SupplierReportDTO {
  supplierId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxId?: string;
  paymentTerm?: string;
  productsSupplied?: string[];

  createdAt: Date;
  updatedAt?: Date;

  totalPurchases: number;
  totalQuantityPurchased: number;
  lastPurchaseDate?: Date;

  constructor(
    supplierId: string,
    name: string,
    createdAt: Date,
    totalPurchases: number,
    totalQuantityPurchased: number,
    lastPurchaseDate?: Date,
    email?: string,
    phone?: string,
    address?: string,
    companyName?: string,
    taxId?: string,
    paymentTerm?: string,
    productsSupplied?: string[],
    updatedAt?: Date,
  ) {
    this.supplierId = supplierId;
    this.name = name;
    this.createdAt = createdAt;
    this.totalPurchases = totalPurchases;
    this.totalQuantityPurchased = totalQuantityPurchased;
    this.lastPurchaseDate = lastPurchaseDate;

    this.email = email;
    this.phone = phone;
    this.address = address;
    this.companyName = companyName;
    this.taxId = taxId;
    this.paymentTerm = paymentTerm;
    this.productsSupplied = productsSupplied;
    this.updatedAt = updatedAt;
  }

  static fromData(supplier: Supplier, purchases: Purchase[]): SupplierReportDTO {
    const totalPurchases = purchases.length;
    const totalQuantityPurchased = purchases.reduce((sum, p) => sum + p.quantity, 0);

    const lastPurchaseDate = purchases
      .map(p => (p.createdAt instanceof Timestamp ? p.createdAt.toDate() : p.createdAt))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return new SupplierReportDTO(
      supplier.id,
      supplier.name,
      supplier.createdAt.toDate(),
      totalPurchases,
      totalQuantityPurchased,
      lastPurchaseDate,
      supplier.email,
      supplier.phone,
      supplier.address,
      supplier.companyName,
      supplier.taxId,
      supplier.paymentTerm,
      supplier.productsSupplied,
      supplier.updatedAt?.toDate(),
    );
  }
}

export { SupplierReportDTO };
