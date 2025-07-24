import { CRMUser, CRMUserRole } from '../types/User';

class UserDTO {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: CRMUserRole;
  isActive: boolean;
  profilePictureUrl?: string;
  department?: string;
  assignedLeads?: string[];
  notes?: string;
  permissions?: string[];
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  lastActivityAt?: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    role: CRMUserRole,
    isActive: boolean,
    createdAt: Date,
    phone?: string,
    address?: string,
    profilePictureUrl?: string,
    department?: string,
    assignedLeads?: string[],
    notes?: string,
    permissions?: string[],
    updatedAt?: Date,
    lastLoginAt?: Date,
    lastActivityAt?: Date
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.role = role;
    this.isActive = isActive;
    this.profilePictureUrl = profilePictureUrl;
    this.department = department;
    this.assignedLeads = assignedLeads;
    this.notes = notes;
    this.permissions = permissions;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
    this.lastActivityAt = lastActivityAt;
  }

  static fromFirestore(id: string, data: CRMUser): UserDTO {
    return new UserDTO(
      id,
      data.email,
      data.name,
      data.role || 'user',
      data.isActive ?? true,
      data.createdAt?.toDate() ?? new Date(),
      data.phone,
      data.address,
      data.profilePictureUrl,
      data.department,
      data.assignedLeads,
      data.notes,
      data.permissions,
      data.updatedAt?.toDate(),
      data.lastLoginAt?.toDate(),
      data.lastActivityAt?.toDate()
    );
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      phone: this.phone,
      address: this.address,
      role: this.role,
      isActive: this.isActive,
      profilePictureUrl: this.profilePictureUrl,
      department: this.department,
      assignedLeads: this.assignedLeads,
      notes: this.notes,
      permissions: this.permissions,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      lastLoginAt: this.lastLoginAt?.toISOString(),
      lastActivityAt: this.lastActivityAt?.toISOString(),
    };
  }
}

export { UserDTO };
