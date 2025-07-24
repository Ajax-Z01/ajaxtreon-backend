import { Order } from '../types/Order';

export class SalesReportDTO {
  orderId: string;
  customerId: string;
  orderDate: Date;
  totalQuantity: number;
  totalItems: number;
  totalAmount: number;
  paymentMethod?: string;

  constructor(
    orderId: string,
    customerId: string,
    orderDate: Date,
    totalQuantity: number,
    totalItems: number,
    totalAmount: number,
    paymentMethod?: string
  ) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.orderDate = orderDate;
    this.totalQuantity = totalQuantity;
    this.totalItems = totalItems;
    this.totalAmount = totalAmount;
    this.paymentMethod = paymentMethod;
  }

  static fromOrder(order: Order): SalesReportDTO | null {
    if (order.status !== 'completed' || order.isDeleted) return null;

    const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalItems = order.items.length;

    return new SalesReportDTO(
      order.id,
      order.customerId,
      orderDate,
      totalQuantity,
      totalItems,
      order.totalAmount,
      order.paymentMethod
    );
  }
}
