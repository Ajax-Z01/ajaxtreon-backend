import { Customer, ContactPerson } from '../types/Customer';

class CustomerDTO {
  id: string;
  firebaseUid: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  billingAddress?: string;
  contactPersons?: ContactPerson[];
  loyaltyMemberId?: string;
  notes?: string;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(
    id: string,
    firebaseUid: string,
    name: string,
    createdAt: Date | null,
    updatedAt: Date | null,
    email?: string,
    phone?: string,
    address?: string,
    billingAddress?: string,
    contactPersons?: ContactPerson[],
    loyaltyMemberId?: string,
    notes?: string
  ) {
    this.id = id;
    this.firebaseUid = firebaseUid;
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

  static fromFirestore(id: string, data: Partial<Customer>): CustomerDTO {
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

    return new CustomerDTO(
      id,
      data.firebaseUid ?? '',
      data.name ?? '',
      createdAt,
      updatedAt,
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
      firebaseUid: this.firebaseUid,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      billingAddress: this.billingAddress,
      contactPersons: this.contactPersons,
      loyaltyMemberId: this.loyaltyMemberId,
      notes: this.notes,
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }
}

export { CustomerDTO };
