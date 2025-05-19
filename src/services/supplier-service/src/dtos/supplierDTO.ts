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
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
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

  static fromFirestore(id: string, data: Supplier): SupplierDTO {
    return new SupplierDTO(
      id,
      data.name,
      data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate?.() ?? new Date(),
      data.updatedAt instanceof Date ? data.updatedAt : data.updatedAt.toDate?.() ?? new Date(),
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
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}

export { SupplierDTO };
