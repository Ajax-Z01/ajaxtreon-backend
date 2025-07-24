import { UserData, UserRole } from '../types/User';

class UserDTO {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    role: UserRole,
    isActive: boolean,
    createdAt: Date,
    phone?: string,
    address?: string,
    profilePictureUrl?: string,
    updatedAt?: Date,
    lastLoginAt?: Date
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.role = role;
    this.isActive = isActive;
    this.profilePictureUrl = profilePictureUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
  }

  static fromFirestore(id: string, data: UserData): UserDTO {
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
      data.updatedAt?.toDate(),
      data.lastLoginAt?.toDate()
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
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      lastLoginAt: this.lastLoginAt?.toISOString()
    };
  }
}

export { UserDTO };
