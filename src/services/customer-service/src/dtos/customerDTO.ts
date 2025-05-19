import { Customer, ContactPerson } from '../types/customer';

class CustomerDTO {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  billingAddress?: string;
  contactPersons?: ContactPerson[];
  loyaltyMemberId?: string;
  notes?: string;
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
    billingAddress?: string,
    contactPersons?: ContactPerson[],
    loyaltyMemberId?: string,
    notes?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.billingAddress = billingAddress;
    this.contactPersons = contactPersons;
    this.loyaltyMemberId = loyaltyMemberId;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromFirestore(id: string, data: Customer): CustomerDTO {
    return new CustomerDTO(
      id,
      data.name,
      data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate?.() ?? new Date(),
      data.updatedAt instanceof Date ? data.updatedAt : data.updatedAt.toDate?.() ?? new Date(),
      data.email,
      data.phone,
      data.address,
      data.billingAddress,
      data.contactPersons,
      data.loyaltyMemberId,
      data.notes
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      billingAddress: this.billingAddress,
      contactPersons: this.contactPersons,
      loyaltyMemberId: this.loyaltyMemberId,
      notes: this.notes,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export { CustomerDTO };
