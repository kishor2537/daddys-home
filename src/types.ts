export type Language = 'en' | 'ta';

export interface Product {
  id: string;
  nameEn: string;
  nameTa: string;
  taglineEn: string;
  taglineTa: string;
  descriptionEn: string;
  descriptionTa: string;
  unitEn: string;
  unitTa: string;
  price: number; // in INR (₹)
  stock: number;
  imageUrl: string;
  featured: boolean;
  isBestSeller?: boolean;
  badgeEn?: string;
  badgeTa?: string;
  originEn?: string;
  originTa?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export type PaymentMethod = 'Google Pay' | 'PhonePe' | 'Paytm' | 'UPI' | 'Razorpay';

export interface OrderItemSummary {
  productId: string;
  nameEn: string;
  nameTa: string;
  quantity: number;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  items: OrderItemSummary[];
  productName: string;
  quantity: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  createdAt: string;
  whatsappMessage?: string;
  whatsappUrl?: string;
  customerSmsSent?: boolean;
  adminSmsSent?: boolean;
}

export interface WhatsAppNotificationLog {
  id: string;
  orderId: string;
  recipient: string;
  phoneNumber: string;
  message: string;
  status: 'Ready' | 'Sent via WhatsApp' | 'Clicked';
  sentAt: string;
}
