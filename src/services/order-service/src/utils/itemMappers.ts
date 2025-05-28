import { OrderItem } from '../types/order';
import { ItemDetails } from '../types/payment';

export function mapItemDetailsToOrderItem(items: ItemDetails[]): OrderItem[] {
  return items.map(item => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
  }));
}

export function buildPaymentItems(
  items: ItemDetails[],
  discount: number = 0,
  taxPercentage: number = 0
): ItemDetails[] {
  const adjustedItems = [...items];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (discount > 0) {
    adjustedItems.push({
      id: 'discount',
      name: 'Discount',
      price: -discount,
      quantity: 1,
    });
  }

  if (taxPercentage > 0) {
    const taxAmount = Math.round(((subtotal - discount) * taxPercentage) / 100);
    adjustedItems.push({
      id: 'tax',
      name: 'Tax',
      price: taxAmount,
      quantity: 1,
    });
  }

  return adjustedItems;
}
