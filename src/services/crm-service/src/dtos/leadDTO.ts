import { Lead } from '../types/Lead';

class LeadDTO {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  assignedTo?: string; // userId or user reference
  notes?: string;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(
    id: string,
    name: string,
    createdAt: Date | null,
    updatedAt: Date | null,
    email?: string,
    phone?: string,
    status?: string,
    assignedTo?: string,
    notes?: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.assignedTo = assignedTo;
    this.notes = notes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromFirestore(id: string, data: Partial<Lead>): LeadDTO {
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

    return new LeadDTO(
      id,
      data.name ?? '',
      createdAt,
      updatedAt,
      data.email,
      data.phone,
      data.status,
      data.assignedTo,
      data.notes
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      status: this.status,
      assignedTo: this.assignedTo,
      notes: this.notes,
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
    };
  }
}

export { LeadDTO };
