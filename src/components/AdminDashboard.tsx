import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Send,
  CheckCircle,
  Phone,
  MessageCircle,
  Lock,
  Layers,
  Search,
  ExternalLink,
  Shield,
  Settings,
  Copy,
  Check,
} from 'lucide-react';
import { Product, Order, WhatsAppNotificationLog, Language, OrderStatus } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import {
  generateWhatsAppOrderMessage,
  getWhatsAppOrderUrl,
  getContactWhatsAppUrl,
  ADMIN_DISPLAY_PHONE,
  ADMIN_RAW_PHONE,
  ADMIN_WHATSAPP_NUMBER,
} from '../utils/whatsapp';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  language: Language;
  onProductsUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  language,
  onProductsUpdated,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  // Auth gate (simple PIN for easy admin entry in mobile / first-time user)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Tabs: 'orders' | 'inventory' | 'whatsapp-logs' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'whatsapp-logs' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState<string | null>(null);

  // WhatsApp Logs State
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppNotificationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);

  // Add / Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  // Test WhatsApp message composer state
  const [testPhone, setTestPhone] = useState<string>(ADMIN_RAW_PHONE);
  const [testMessage, setTestMessage] = useState<string>(
    "Hello Daddy's Home! Testing WhatsApp Click-to-Chat notification system."
  );
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Fetch Orders and Logs
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchWhatsAppLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await api.getWhatsAppLogs();
      setWhatsappLogs(logs);
    } catch (err) {
      console.error('Error fetching WhatsApp logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchOrders();
      fetchWhatsAppLogs();
    }
  }, [isOpen, isAuthenticated]);

  // Handle PIN authentication
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '9842') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid Admin PIN. Use 1234 to enter.');
    }
  };

  // Update Order Status
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      setStatusSuccessMessage(
        `Order #${orderId} updated to ${newStatus}. Customer WhatsApp link ready.`
      );
      fetchOrders();
      fetchWhatsAppLogs();
      setTimeout(() => setStatusSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Inline Stock Adjustment
  const handleStockAdjust = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      await api.updateProduct(product.id, { stock: newStock });
      onProductsUpdated();
    } catch (err: any) {
      alert(`Error updating stock: ${err.message}`);
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.nameEn || !editingProduct?.price) {
      alert('Please enter product name and price');
      return;
    }
    setIsSavingProduct(true);
    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
      } else {
        await api.addProduct(editingProduct);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      onProductsUpdated();
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.deleteProduct(id);
        onProductsUpdated();
      } catch (err: any) {
        alert(`Error deleting product: ${err.message}`);
      }
    }
  };

  // Copy helper
  const handleCopy = (text: string, orderId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
  const totalBalanceDue = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);
  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.phoneNumber.includes(orderSearch) ||
      order.deliveryAddress.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative bg-stone-100 rounded-3xl max-w-5xl w-full shadow-2xl border-2 border-emerald-700/60 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header Strip */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-lg shadow-md">
              DH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">{t.adminTitle}</h2>
                <span className="bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <MessageCircle className="w-3 h-3 fill-current" />
                  <span>WhatsApp: {ADMIN_DISPLAY_PHONE}</span>
                </span>
              </div>
              <p className="text-xs text-emerald-300/90">{t.adminSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Authentication Gate */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-sm mx-auto text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Admin Authentication</h3>
            <p className="text-xs text-stone-500">
              Enter Admin PIN to manage inventory and WhatsApp orders. (Default PIN:{' '}
              <code className="font-bold text-emerald-700">1234</code>)
            </p>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (1234)"
                className="w-full px-4 py-2.5 text-center text-lg font-black tracking-widest bg-white border border-stone-300 rounded-xl"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-600 font-semibold">{pinError}</p>}
              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Status Alert Toast */}
            {statusSuccessMessage && (
              <div className="bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 text-center flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle className="w-4 h-4 text-amber-300" />
                <span>{statusSuccessMessage}</span>
              </div>
            )}

            {/* Quick Metrics Strip */}
            <div className="bg-white border-b border-stone-200 p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200">
                <span className="text-[10px] text-amber-900 font-bold uppercase block">{t.totalOrders}</span>
                <span className="text-xl font-black text-amber-950">{orders.length}</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">{t.totalRevenue} (50%)</span>
                <span className="text-xl font-black text-emerald-900">₹{totalRevenue}</span>
              </div>
              <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
                <span className="text-[10px] text-stone-600 font-bold uppercase block">Balance on Delivery</span>
                <span className="text-xl font-black text-stone-900">₹{totalBalanceDue}</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">{t.pendingOrders}</span>
                <span className="text-xl font-black text-blue-900">{pendingCount}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-stone-200/80 px-4 pt-2 border-b border-stone-300 flex gap-2 shrink-0 overflow-x-auto">
              {[
                { id: 'orders', label: `1. ${t.ordersList} (${orders.length})`, icon: ShoppingBag },
                { id: 'inventory', label: `2. ${t.liveInventory} (${products.length})`, icon: Package },
                { id: 'whatsapp-logs', label: `3. ${t.viewWhatsAppLogs} (${whatsappLogs.length})`, icon: MessageCircle },
                { id: 'settings', label: `4. ${t.whatsAppSystem}`, icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-emerald-950 shadow-xs border-t-2 border-emerald-700'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* TAB 1: CUSTOMER ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-center bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Name, Phone..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <span className="text-xs text-stone-500 font-bold">Filter:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={fetchOrders}
                        className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 transition"
                        title="Refresh Orders"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                        <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-stone-600">No orders found</p>
                        <p className="text-xs text-stone-400">Orders placed by customers will appear here in real time.</p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => {
                        const isUpdating = updatingOrderId === order.id;
                        const orderWaMsg =
                          order.whatsappMessage ||
                          generateWhatsAppOrderMessage({
                            id: order.id,
                            customerName: order.customerName,
                            phoneNumber: order.phoneNumber,
                            deliveryAddress: order.deliveryAddress,
                            productName: order.productName,
                            quantity: order.quantity,
                            totalAmount: order.totalAmount,
                            advancePaid: order.advancePaid,
                            createdAt: order.createdAt,
                          });

                        const adminWaUrl =
                          order.whatsappUrl ||
                          getWhatsAppOrderUrl({
                            id: order.id,
                            customerName: order.customerName,
                            phoneNumber: order.phoneNumber,
                            deliveryAddress: order.deliveryAddress,
                            productName: order.productName,
                            quantity: order.quantity,
                            totalAmount: order.totalAmount,
                            advancePaid: order.advancePaid,
                            createdAt: order.createdAt,
                          });

                        const customerWaUrl = `https://wa.me/91${order.phoneNumber.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(
                          `Hello ${order.customerName}, regarding your Daddy's Home order #${order.id}:`
                        )}`;

                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-amber-300 transition space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                              <div>
                                <span className="font-mono font-black text-sm text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {order.id}
                                </span>
                                <span className="text-xs text-stone-500 ml-2">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                              </div>

                              {/* Status dropdown */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-stone-500">Status:</span>
                                <select
                                  value={order.orderStatus}
                                  disabled={isUpdating}
                                  onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                                    order.orderStatus === 'Delivered'
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : order.orderStatus === 'Shipped'
                                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                                      : order.orderStatus === 'Cancelled'
                                      ? 'bg-red-100 text-red-900 border-red-300'
                                      : 'bg-amber-100 text-amber-900 border-amber-300'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Customer & Address Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="space-y-1">
                                <span className="text-stone-500 font-medium block">Customer:</span>
                                <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
                                <div className="flex items-center gap-2 pt-1">
                                  <a
                                    href={`tel:${order.phoneNumber}`}
                                    className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>+91 {order.phoneNumber}</span>
                                  </a>
                                  <a
                                    href={customerWaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[#25D366] hover:opacity-80 font-bold"
                                    title="Chat with Customer on WhatsApp"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-[10px]">Chat</span>
                                  </a>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-stone-500 font-medium block">Delivery Address:</span>
                                <p className="font-medium text-stone-700 leading-snug">
                                  {order.deliveryAddress}
                                </p>
                              </div>

                              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-stone-500">Products:</span>
                                  <span className="font-bold text-stone-900 text-right">{order.productName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-500">Total Qty:</span>
                                  <span className="font-bold text-stone-900">{order.quantity}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-stone-200">
                                  <span className="font-bold text-emerald-800">50% Advance Paid:</span>
                                  <span className="font-black text-emerald-700">₹{order.advancePaid}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-stone-700">Balance on Delivery:</span>
                                  <span className="font-black text-stone-900">₹{order.balanceDue}</span>
                                </div>
                              </div>
                            </div>

                            {/* WhatsApp Quick Actions Footer */}
                            <div className="bg-emerald-50/60 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 border border-emerald-100 text-xs">
                              <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                                <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                                <span>WhatsApp Order Notification:</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopy(orderWaMsg, order.id)}
                                  className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 font-semibold flex items-center gap-1 transition"
                                >
                                  {copiedOrderId === order.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Message</span>
                                    </>
                                  )}
                                </button>

                                <a
                                  href={adminWaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                  <span>Send on WhatsApp ({ADMIN_RAW_PHONE})</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: INVENTORY MANAGEMENT */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">{t.liveInventory}</h3>
                      <p className="text-xs text-stone-500">
                        Adjust stock numbers in real time. Items reaching zero automatically show &quot;Out of Stock&quot; to customers.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          nameEn: '',
                          nameTa: '',
                          taglineEn: '',
                          taglineTa: '',
                          unitEn: '500g Pouch',
                          unitTa: '500 கிராம்',
                          price: 150,
                          stock: 50,
                          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
                          featured: true,
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.addProduct}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-xs flex items-center gap-3 hover:border-amber-300 transition"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.nameEn}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-stone-900 text-xs truncate">
                            {product.nameEn}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">{product.nameTa}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-black text-xs text-emerald-900">₹{product.price}</span>
                            <span className="text-[10px] text-stone-400">/ {product.unitEn}</span>
                          </div>
                        </div>

                        {/* Stock Controls */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                            <button
                              onClick={() => handleStockAdjust(product, -5)}
                              className="w-6 h-6 rounded-lg bg-white font-bold text-stone-700 hover:bg-stone-200 flex items-center justify-center text-xs shadow-xs"
                              title="-5"
                            >
                              -
                            </button>
                            <span
                              className={`w-8 text-center text-xs font-black ${
                                product.stock === 0
                                  ? 'text-red-600'
                                  : product.stock < 10
                                  ? 'text-amber-600'
                                  : 'text-stone-900'
                              }`}
                            >
                              {product.stock}
                            </span>
                            <button
                              onClick={() => handleStockAdjust(product, 5)}
                              className="w-6 h-6 rounded-lg bg-white font-bold text-stone-700 hover:bg-stone-200 flex items-center justify-center text-xs shadow-xs"
                              title="+5"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                              title="Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.nameEn)}
                              className="p-1 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WHATSAPP ORDER NOTIFICATIONS LOG */}
              {activeTab === 'whatsapp-logs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">{t.viewWhatsAppLogs}</h3>
                      <p className="text-xs text-stone-500">
                        Record of all WhatsApp order messages formatted for <strong>{ADMIN_DISPLAY_PHONE}</strong>.
                      </p>
                    </div>
                    <button
                      onClick={fetchWhatsAppLogs}
                      className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-3 py-1.5 rounded-xl text-xs border border-stone-300"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {whatsappLogs.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                        <MessageCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-stone-700">No WhatsApp order logs recorded yet</p>
                      </div>
                    ) : (
                      whatsappLogs.map((log) => (
                        <div
                          key={log.id}
                          className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 fill-current text-[#25D366]" />
                                <span>WhatsApp Notification</span>
                              </span>
                              <span className="font-bold text-stone-900">
                                Target: {ADMIN_DISPLAY_PHONE}
                              </span>
                              <span className="text-stone-400 font-mono">({log.orderId})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(log.message)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition shadow-xs"
                              >
                                <span>Open in WhatsApp</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="bg-stone-900 text-amber-200 rounded-xl p-3 font-mono text-[11px] whitespace-pre-line leading-relaxed select-all">
                            {log.message}
                          </div>

                          <div className="text-[10px] text-stone-400 text-right">
                            Prepared on: {new Date(log.sentAt || log.createdAt || Date.now()).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: WHATSAPP SYSTEM SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-xl">
                  {/* WhatsApp Integration Details */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-[#25D366] fill-current" />
                        <span>WhatsApp Click-to-Chat Order System</span>
                      </h3>
                      <span className="bg-[#25D366] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {ADMIN_RAW_PHONE}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      Daddy&apos;s Home now uses a direct WhatsApp Order System. When a customer confirms an order and completes the 50% advance payment:
                    </p>

                    <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <div className="font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#25D366]" />
                        <span>1. Instant WhatsApp Message Generated Automatically</span>
                      </div>
                      <div className="font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#25D366]" />
                        <span>2. &quot;Send Order on WhatsApp&quot; button opens chat with {ADMIN_DISPLAY_PHONE}</span>
                      </div>
                      <div className="font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#25D366]" />
                        <span>3. &quot;Contact Daddy&apos;s Home&quot; button opens direct support chat</span>
                      </div>
                      <div className="font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#25D366]" />
                        <span>4. Zero SMS Gateway costs, no Twilio credentials required</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-stone-800 mb-1">Click-to-Chat Standard URL:</h4>
                      <code className="block bg-stone-100 p-2.5 rounded-xl text-stone-800 text-xs font-mono break-all border border-stone-200">
                        https://wa.me/919360145259?text={'{encoded_message}'}
                      </code>
                    </div>
                  </div>

                  {/* Test WhatsApp Chat Launcher */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Send className="w-4 h-4 text-emerald-700" />
                      <span>Test WhatsApp Click-to-Chat</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      Test opening a formatted message directly on WhatsApp Web or mobile app.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          Recipient Phone Number:
                        </label>
                        <input
                          type="tel"
                          value={testPhone}
                          onChange={(e) => setTestPhone(e.target.value)}
                          placeholder={`e.g. ${ADMIN_RAW_PHONE}`}
                          className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          Test Message:
                        </label>
                        <textarea
                          rows={3}
                          value={testMessage}
                          onChange={(e) => setTestMessage(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                        />
                      </div>

                      <a
                        href={`https://wa.me/91${testPhone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(
                          testMessage
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Open in WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* Add/Edit Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
            <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="font-bold text-stone-900 text-sm">
                  {editingProduct?.id ? t.editProduct : t.addProduct}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Product Name (English)*</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.nameEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                    placeholder="e.g. Pure Turmeric Powder"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Product Name (Tamil)*</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.nameTa || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameTa: e.target.value })}
                    placeholder="எ.கா. தூய மஞ்சள் தூள்"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Price (₹)*</label>
                    <input
                      type="number"
                      required
                      value={editingProduct?.price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Available Stock*</label>
                    <input
                      type="number"
                      required
                      value={editingProduct?.stock || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Unit Specification</label>
                  <input
                    type="text"
                    value={editingProduct?.unitEn || '500g Pouch'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unitEn: e.target.value })}
                    placeholder="e.g. 500g Pouch / 1kg"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProduct?.imageUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-xs disabled:opacity-50"
                  >
                    {isSavingProduct ? 'Saving...' : t.saveChanges}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
