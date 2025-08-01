import { Customer } from '../types/Customer';
import { Order } from '../types/Order';

class CustomerReportDTO {
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  billingAddress?: string;
  contactPersons?: Customer['contactPersons'];
  loyaltyMemberId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  totalOrders: number;
  totalCompletedOrders: number;
  totalPendingOrders: number;
  totalCancelledOrders: number;

  totalAmountSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;

  constructor(
    customer: Customer,
    orders: Order[]
  ) {
    this.customerId = customer.id;
    this.name = customer.name;
    this.email = customer.email;
    this.phone = customer.phone;
    this.address = customer.address;
    this.billingAddress = customer.billingAddress;
    this.contactPersons = customer.contactPersons;
    this.loyaltyMemberId = customer.loyaltyMemberId;
    this.notes = customer.notes;
    
    this.createdAt = customer.createdAt ? customer.createdAt.toDate() : new Date(0);
    this.updatedAt = customer.updatedAt ? customer.updatedAt.toDate() : new Date(0);

    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalOrders = orders.length;

    this.totalOrders = totalOrders;
    this.totalCompletedOrders = completedOrders.length;
    this.totalPendingOrders = orders.filter(o => o.status === 'pending').length;
    this.totalCancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    this.totalAmountSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    this.averageOrderValue = this.totalCompletedOrders > 0
      ? this.totalAmountSpent / this.totalCompletedOrders
      : 0;

    this.lastOrderDate = orders
      .map(o => o.createdAt && o.createdAt.toDate ? o.createdAt.toDate() : null)
      .filter((d): d is Date => d instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0];
  }

  static fromData(customer: Customer, orders: Order[]): CustomerReportDTO {
    return new CustomerReportDTO(customer, orders);
  }
}

export { CustomerReportDTO };
