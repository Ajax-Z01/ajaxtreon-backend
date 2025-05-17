import type { Order, OrderItem } from '../types/order';

class SalesReportDTO {
  customerId: string;
  productId: string;
  quantity: number;
  createdAt: Date;

  constructor(customerId: string, productId: string, quantity: number, createdAt: Date) {
    this.customerId = customerId;
    this.productId = productId;
    this.quantity = quantity;
    this.createdAt = createdAt;
  }

  static fromOrder(order: Order): SalesReportDTO[] {
    const createdAt = order.createdAt?.toDate?.() ?? new Date();

    return order.items.map((item: OrderItem) => new SalesReportDTO(
      order.customerId,
      item.productId,
      item.quantity,
      createdAt
    ));
  }
}

export { SalesReportDTO };
