import { Supplier, ContactPerson } from '../types/supplier';

class SupplierDTO {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  contactPersons?: ContactPerson[];
  taxId?: string;
  paymentTerm?: string;
  productsSupplied?: string[];
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(
    id: string,
    name: string,
    createdAt: Date | null,
    updatedAt: Date | null,
    email?: string,
    phone?: string,
    address?: string,
    companyName?: string,
    contactPersons?: ContactPerson[],
    taxId?: string,
    paymentTerm?: string,
    productsSupplied?: string[]
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.companyName = companyName;
    this.contactPersons = contactPersons;
    this.taxId = taxId;
    this.paymentTerm = paymentTerm;
    this.productsSupplied = productsSupplied;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromFirestore(id: string, data: Partial<Supplier>): SupplierDTO {
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

    return new SupplierDTO(
      id,
      data.name ?? '',
      createdAt,
      updatedAt,
      data.email,
      data.phone,
      data.address,
      data.companyName,
      data.contactPersons,
      data.taxId,
      data.paymentTerm,
      data.productsSupplied
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      companyName: this.companyName,
      contactPersons: this.contactPersons,
      taxId: this.taxId,
      paymentTerm: this.paymentTerm,
      productsSupplied: this.productsSupplied,
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }
}

export { SupplierDTO };
