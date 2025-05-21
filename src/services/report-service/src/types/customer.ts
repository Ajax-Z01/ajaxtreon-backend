import { Timestamp } from 'firebase-admin/firestore';

export interface ContactPerson {
  name: string;
  phone?: string;
  email?: string;
  position?: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  billingAddress?: string;
  contactPersons?: ContactPerson[];
  loyaltyMemberId?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
