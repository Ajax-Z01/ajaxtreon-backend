import { Order } from '../types/Order';

export class RevenueReportDTO {
  orderId: string;
  customerId: string;
  orderDate: Date;
  totalAmount: number;
  refundAmount: number;
  netRevenue: number;
  paymentMethod?: string;

  constructor(
    orderId: string,
    customerId: string,
    orderDate: Date,
    totalAmount: number,
    refundAmount: number,
    paymentMethod?: string,
  ) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.orderDate = orderDate;
    this.totalAmount = totalAmount;
    this.refundAmount = refundAmount;
    this.netRevenue = totalAmount - refundAmount;
    this.paymentMethod = paymentMethod;
  }

  static fromOrder(order: Order): RevenueReportDTO | null {
    if (order.status !== 'completed' || order.isDeleted) return null;
    const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();
    return new RevenueReportDTO(
      order.id,
      order.customerId,
      orderDate,
      order.totalAmount,
      order.refundAmount ?? 0,
      order.paymentMethod
    );
  }
}
