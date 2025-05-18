import type { UserData } from '../types/user';
import type { Order } from '../types/order';

class CustomerReportDTO {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: string;
  isActive: boolean;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;

  totalOrders: number;
  totalCompletedOrders: number;
  totalPendingOrders: number;
  totalCancelledOrders: number;

  totalAmountSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;

  constructor(
    userId: string,
    email: string,
    name: string,
    role: string,
    isActive: boolean,
    createdAt: Date,
    totalOrders: number,
    totalCompletedOrders: number,
    totalPendingOrders: number,
    totalCancelledOrders: number,
    totalAmountSpent: number,
    averageOrderValue: number,
    lastOrderDate?: Date,
    phone?: string,
    address?: string,
    profilePictureUrl?: string,
    updatedAt?: Date,
    lastLoginAt?: Date,
  ) {
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.totalOrders = totalOrders;
    this.totalCompletedOrders = totalCompletedOrders;
    this.totalPendingOrders = totalPendingOrders;
    this.totalCancelledOrders = totalCancelledOrders;
    this.totalAmountSpent = totalAmountSpent;
    this.averageOrderValue = averageOrderValue;
    this.lastOrderDate = lastOrderDate;
    this.phone = phone;
    this.address = address;
    this.profilePictureUrl = profilePictureUrl;
    this.updatedAt = updatedAt;
    this.lastLoginAt = lastLoginAt;
  }

  static fromData(user: UserData, orders: Order[]): CustomerReportDTO {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalCompletedOrders = completedOrders.length;
    const totalPendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalCancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    const totalAmountSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = totalCompletedOrders > 0 ? totalAmountSpent / totalCompletedOrders : 0;

    const lastOrderDate = orders
      .map(o => o.createdAt?.toDate?.())
      .filter((d): d is Date => d !== undefined)
      .sort((a, b) => b.getTime() - a.getTime())[0];

    return new CustomerReportDTO(
      user.id,
      user.email,
      user.name,
      user.role,
      user.isActive,
      user.createdAt.toDate(),
      totalOrders,
      totalCompletedOrders,
      totalPendingOrders,
      totalCancelledOrders,
      totalAmountSpent,
      averageOrderValue,
      lastOrderDate,
      user.phone,
      user.address,
      user.profilePictureUrl,
      user.updatedAt?.toDate(),
      user.lastLoginAt?.toDate()
    );
  }
}

export { CustomerReportDTO };
