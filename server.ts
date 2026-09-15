import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initialProducts } from './src/data/initialProducts';

interface ProductItem {
  id: string;
  nameEn: string;
  nameTa: string;
  taglineEn: string;
  taglineTa: string;
  descriptionEn: string;
  descriptionTa: string;
  unitEn: string;
  unitTa: string;
  price: number;
  stock: number;
  imageUrl: string;
  featured: boolean;
  isBestSeller?: boolean;
  badgeEn?: string;
  badgeTa?: string;
  originEn?: string;
  originTa?: string;
}

interface OrderItem {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  items: Array<{
    productId: string;
    nameEn: string;
    nameTa: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  productName: string;
  quantity: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  whatsappMessage?: string;
  whatsappUrl?: string;
}

interface WhatsAppNotificationRecord {
  id: string;
  orderId: string;
  recipient: string;
  phoneNumber: string;
  message: string;
  clickToChatUrl: string;
  status: 'Ready' | 'Sent via WhatsApp';
  createdAt: string;
}

const ADMIN_WHATSAPP_PHONE = process.env.ADMIN_PHONE_NUMBER || '9360145259';

/**
 * Formats the exact WhatsApp Order Notification text requested by user
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
function formatWhatsAppOrderMessage(order: {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  advancePaid: number;
  createdAt?: string;
}): string {
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
 * Generates official WhatsApp Click-to-Chat URL
 * https://wa.me/919360145259?text=${encodeURIComponent(orderMessage)}
 */
function buildWhatsAppClickToChatUrl(message: string, phone: string = ADMIN_WHATSAPP_PHONE): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// In-memory products store
let products: ProductItem[] = JSON.parse(JSON.stringify(initialProducts));

// Initial seeded order with WhatsApp notification
const seedDate = new Date(Date.now() - 3600000 * 4).toISOString();
const seedOrderDetails = {
  id: 'DH-8491',
  customerName: 'Karthik Subramanian',
  phoneNumber: '9840123456',
  deliveryAddress: 'No. 14, Gandhi Salai, Rasipuram, Namakkal - 637408',
  productName: 'Pure Turmeric Powder (2), Country Hen Eggs (1)',
  quantity: 3,
  totalAmount: 520,
  advancePaid: 260,
  createdAt: seedDate,
};
const seedWhatsAppMsg = formatWhatsAppOrderMessage(seedOrderDetails);
const seedWhatsAppUrl = buildWhatsAppClickToChatUrl(seedWhatsAppMsg);

let orders: OrderItem[] = [
  {
    ...seedOrderDetails,
    items: [
      {
        productId: 'dh-turmeric-01',
        nameEn: 'Pure Turmeric Powder',
        nameTa: 'கொல்லிமலை தூய மஞ்சள் தூள்',
        quantity: 2,
        price: 180,
        unit: '500g Pouch',
      },
      {
        productId: 'dh-country-eggs-03',
        nameEn: 'Country Hen Eggs (Naatu Kozhi Muttai)',
        nameTa: 'நாட்டுக்கோழி முட்டை',
        quantity: 1,
        price: 160,
        unit: 'Pack of 10 Eggs',
      },
    ],
    balanceDue: 260,
    paymentStatus: 'Paid',
    paymentMethod: 'Google Pay',
    orderStatus: 'Confirmed',
    whatsappMessage: seedWhatsAppMsg,
    whatsappUrl: seedWhatsAppUrl,
  },
];

let whatsappLogs: WhatsAppNotificationRecord[] = [
  {
    id: 'WA-101',
    orderId: 'DH-8491',
    recipient: "Daddy's Home Admin",
    phoneNumber: '+919360145259',
    message: seedWhatsAppMsg,
    clickToChatUrl: seedWhatsAppUrl,
    status: 'Ready',
    createdAt: seedDate,
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      brand: "Daddy's Home",
      notificationSystem: 'WhatsApp Click-to-Chat',
      adminPhone: '+919360145259',
      serverTime: new Date().toISOString(),
    });
  });

  // 2. Products Catalog
  app.get('/api/products', (req, res) => {
    res.json({ success: true, products });
  });

  // 3. Admin Add Product
  app.post('/api/products', (req, res) => {
    try {
      const newProduct: ProductItem = {
        id: `dh-${Date.now()}`,
        nameEn: req.body.nameEn || 'New Farm Product',
        nameTa: req.body.nameTa || req.body.nameEn || 'புதிய பண்ணை பொருள்',
        taglineEn: req.body.taglineEn || 'Fresh from Kolli Hills',
        taglineTa: req.body.taglineTa || 'கொல்லிமலை பண்ணை உற்பத்தி',
        descriptionEn: req.body.descriptionEn || '',
        descriptionTa: req.body.descriptionTa || '',
        unitEn: req.body.unitEn || '1 Pack',
        unitTa: req.body.unitTa || '1 பாக்கெட்',
        price: Number(req.body.price) || 100,
        stock: Number(req.body.stock) || 50,
        imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        featured: Boolean(req.body.featured),
        originEn: req.body.originEn || 'Kolli Hills, Tamil Nadu',
        originTa: req.body.originTa || 'கொல்லிமலை, தமிழ்நாடு',
      };
      products.push(newProduct);
      res.json({ success: true, product: newProduct });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Admin Edit Product
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    products[index] = { ...products[index], ...req.body };
    res.json({ success: true, product: products[index] });
  });

  // 5. Admin Delete Product
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter((p) => p.id !== id);
    res.json({ success: true, message: 'Product deleted' });
  });

  // 6. Customer & Admin Get Orders
  app.get('/api/orders', (req, res) => {
    const { phone } = req.query;
    if (phone && typeof phone === 'string') {
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      const customerOrders = orders.filter((o) =>
        o.phoneNumber.replace(/[^0-9]/g, '').slice(-10) === cleanPhone
      );
      return res.json({ success: true, orders: customerOrders });
    }
    res.json({ success: true, orders });
  });

  // 7. Customer Create Order with 50% Advance & Automatic WhatsApp Notification Generation
  app.post('/api/orders', async (req, res) => {
    try {
      const { customerName, phoneNumber, deliveryAddress, items, paymentMethod = 'UPI' } = req.body;

      if (!customerName || !phoneNumber || !deliveryAddress || !items || !items.length) {
        return res.status(400).json({ success: false, message: 'All order fields are required' });
      }

      // Calculate total & 50% advance
      let calculatedTotal = 0;
      let totalQty = 0;
      const orderItemsSummary = items.map((item: any) => {
        const prod = products.find((p) => p.id === item.productId);
        const itemPrice = prod ? prod.price : item.price || 100;
        const itemQty = Number(item.quantity) || 1;
        calculatedTotal += itemPrice * itemQty;
        totalQty += itemQty;

        // Decrement stock if item found
        if (prod) {
          prod.stock = Math.max(0, prod.stock - itemQty);
        }

        return {
          productId: item.productId,
          nameEn: prod ? prod.nameEn : item.nameEn || 'Kolli Hills Product',
          nameTa: prod ? prod.nameTa : item.nameTa || 'கொல்லிமலை உற்பத்தி',
          quantity: itemQty,
          price: itemPrice,
          unit: prod ? prod.unitEn : item.unit || 'Pack',
        };
      });

      const advancePaid = Math.round(calculatedTotal * 0.5);
      const balanceDue = calculatedTotal - advancePaid;
      const orderId = `DH-${Math.floor(1000 + Math.random() * 9000)}`;

      const productNameSummary = orderItemsSummary
        .map((i) => `${i.nameEn} (${i.quantity})`)
        .join(', ');

      const createdAt = new Date().toISOString();

      // Automatically generate WhatsApp Order Notification message & Click-to-Chat URL
      const whatsappMessage = formatWhatsAppOrderMessage({
        id: orderId,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        productName: productNameSummary,
        quantity: totalQty,
        totalAmount: calculatedTotal,
        advancePaid,
        createdAt,
      });

      const whatsappUrl = buildWhatsAppClickToChatUrl(whatsappMessage, ADMIN_WHATSAPP_PHONE);

      const newOrder: OrderItem = {
        id: orderId,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        deliveryAddress: deliveryAddress.trim(),
        items: orderItemsSummary,
        productName: productNameSummary,
        quantity: totalQty,
        totalAmount: calculatedTotal,
        advancePaid,
        balanceDue,
        paymentStatus: 'Paid',
        paymentMethod: paymentMethod,
        orderStatus: 'Confirmed',
        createdAt,
        whatsappMessage,
        whatsappUrl,
      };

      orders.unshift(newOrder);

      // Record WhatsApp notification log
      const waLog: WhatsAppNotificationRecord = {
        id: `WA-${Date.now()}`,
        orderId,
        recipient: "Daddy's Home Admin (+919360145259)",
        phoneNumber: '+919360145259',
        message: whatsappMessage,
        clickToChatUrl: whatsappUrl,
        status: 'Ready',
        createdAt,
      };
      whatsappLogs.unshift(waLog);

      console.log(`[WhatsApp Order System] Order ${orderId} confirmed with 50% advance. WhatsApp Click-to-Chat generated for +919360145259`);

      res.status(201).json({
        success: true,
        message: "Your order details have been prepared and sent to Daddy's Home WhatsApp.",
        order: newOrder,
        whatsappMessage,
        whatsappUrl,
        adminPhoneNumber: '+919360145259',
      });
    } catch (err: any) {
      console.error('Order creation error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Admin Update Order Status
  app.patch('/api/orders/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = orders.find((o) => o.id === id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.orderStatus = status;

      // Generate WhatsApp status update link for customer
      const statusUpdateMessage = `Hello ${order.customerName},

Your Daddy's Home order #${order.id} status has been updated to: ${status.toUpperCase()}.

Product: ${order.productName}
Quantity: ${order.quantity}
Balance on Delivery: ₹${order.balanceDue}

Thank you for choosing Daddy's Home, Kolli Hills!`;

      const customerWhatsAppUrl = `https://wa.me/91${order.phoneNumber.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(statusUpdateMessage)}`;

      res.json({
        success: true,
        order,
        customerWhatsAppUrl,
        message: `Order status updated to ${status}. Customer WhatsApp link generated.`,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. WhatsApp Configuration & Click-to-Chat Status
  app.get('/api/whatsapp/config', (req, res) => {
    res.json({
      success: true,
      system: 'WhatsApp Click-to-Chat Notification System',
      adminPhone: '+919360145259',
      adminMobileRaw: '9360145259',
      clickToChatUrl: 'https://wa.me/919360145259',
      instructions: "No SMS gateway or Twilio credentials required. Works natively across all mobile and desktop devices.",
    });
  });

  // 10. WhatsApp Notifications Log
  app.get('/api/whatsapp/logs', (req, res) => {
    res.json({ success: true, logs: whatsappLogs });
  });

  // 11. Razorpay Order Simulation / Config
  app.post('/api/create-razorpay-order', (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

    res.json({
      success: true,
      keyId: razorpayKeyId || 'rzp_test_daddyshome_kollihills',
      orderId: `order_${Date.now()}`,
      amount: amount * 100, // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      brandName: "Daddy's Home - Kolli Hills",
      isLiveConfigured: Boolean(razorpayKeyId),
    });
  });

  // Serve local public images
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Daddy's Home Farm Server running on http://0.0.0.0:${PORT} (WhatsApp System Active)`);
  });
}

startServer();
