export interface WhatsAppOrderDetails {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  advancePaid: number;
  createdAt?: string;
}

export const ADMIN_WHATSAPP_NUMBER = '919360145259';
export const ADMIN_DISPLAY_PHONE = '+91 93601 45259';
export const ADMIN_RAW_PHONE = '9360145259';

/**
 * Generates the standardized WhatsApp Order Notification text
 * with all required order details:
 * - Order ID
 * - Customer Name
 * - Phone Number
 * - Delivery Address
 * - Product Name
 * - Quantity
 * - Total Amount
 * - Advance Amount Paid
 */
export function generateWhatsAppOrderMessage(order: WhatsAppOrderDetails): string {
  return `New Order - Daddy's Home

Order ID: ${order.id}
Customer Name: ${order.customerName}
Phone Number: ${order.phoneNumber}
Delivery Address: ${order.deliveryAddress}
Product Name: ${order.productName}
Quantity: ${order.quantity}
Total Amount: ₹${order.totalAmount}
Advance Amount Paid: ₹${order.advancePaid}`;
}

/**
 * Builds the official WhatsApp Click-to-Chat URL
 * format: https://wa.me/919360145259?text=${encodeURIComponent(orderMessage)}
 */
export function getWhatsAppOrderUrl(order: WhatsAppOrderDetails, phone: string = ADMIN_WHATSAPP_NUMBER): string {
  const orderMessage = generateWhatsAppOrderMessage(order);
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMessage)}`;
}

/**
 * Direct WhatsApp Chat URL to contact Daddy's Home (+91 93601 45259)
 */
export function getContactWhatsAppUrl(phone: string = ADMIN_WHATSAPP_NUMBER, greeting?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (greeting) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`;
  }
  return `https://wa.me/${cleanPhone}`;
}
