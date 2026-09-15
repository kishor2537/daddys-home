import { Product, Order, WhatsAppNotificationLog } from '../types';

export const api = {
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.warn('API error fetching products, using offline fallback', err);
      const { initialProducts } = await import('../data/initialProducts');
      return initialProducts;
    }
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to add product');
    return data.product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete product');
  },

  async getOrders(phone?: string): Promise<Order[]> {
    const url = phone ? `/api/orders?phone=${encodeURIComponent(phone)}` : '/api/orders';
    const res = await fetch(url);
    const data = await res.json();
    return data.orders || [];
  },

  async createOrder(orderPayload: {
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    items: Array<{ productId: string; quantity: number; price?: number }>;
    paymentMethod: string;
  }): Promise<{
    order: Order;
    whatsappMessage: string;
    whatsappUrl: string;
    message: string;
    adminPhoneNumber: string;
  }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to place order');
    return {
      order: data.order,
      whatsappMessage: data.whatsappMessage,
      whatsappUrl: data.whatsappUrl,
      message: data.message,
      adminPhoneNumber: data.adminPhoneNumber || '+919360145259',
    };
  },

  async updateOrderStatus(id: string, status: string): Promise<{ order: Order; customerWhatsAppUrl?: string }> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update status');
    return { order: data.order, customerWhatsAppUrl: data.customerWhatsAppUrl };
  },

  async getWhatsAppLogs(): Promise<WhatsAppNotificationLog[]> {
    try {
      const res = await fetch('/api/whatsapp/logs');
      const data = await res.json();
      return data.logs || [];
    } catch {
      return [];
    }
  },

  async getWhatsAppConfig(): Promise<{ adminPhone: string; clickToChatUrl: string }> {
    try {
      const res = await fetch('/api/whatsapp/config');
      const data = await res.json();
      return {
        adminPhone: data.adminPhone || '+919360145259',
        clickToChatUrl: data.clickToChatUrl || 'https://wa.me/919360145259',
      };
    } catch {
      return {
        adminPhone: '+919360145259',
        clickToChatUrl: 'https://wa.me/919360145259',
      };
    }
  },
};
