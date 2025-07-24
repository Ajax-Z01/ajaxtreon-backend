import { OrderItem, OrderCalculationOptions } from '../types/Order';

export function calculateOrderSummary(
  items: OrderItem[],
  options: OrderCalculationOptions = {}
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountFromPercentage = options.discountPercentage
    ? (subtotal * options.discountPercentage) / 100
    : 0;
  const totalAfterDiscount = subtotal - discountFromPercentage - (options.discount || 0);
  const tax = options.taxPercentage
    ? (totalAfterDiscount * options.taxPercentage) / 100
    : 0;
  const total = totalAfterDiscount + tax;

  return {
    subtotal,
    discount: (options.discount || 0) + discountFromPercentage,
    tax,
    total: Math.round(total),
  };
}

