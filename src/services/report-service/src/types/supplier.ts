import { Timestamp } from 'firebase-admin/firestore';

export interface ContactPerson {
  name: string;
  phone?: string;
  email?: string;
  position?: string;
}

export interface Supplier {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
