import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ContactPage } from './pages/ContactPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { ADMIN_DISPLAY_PHONE, getContactWhatsAppUrl } from './utils/whatsapp';
import { Sprout, MessageCircle, PhoneCall, BookOpen, ShoppingBag, ArrowRight, Home } from 'lucide-react';

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function MainLayout() {
  const {
    language,
    setLanguage,
    cart,
    totalCartCount,
    totalCartAmount,
    totalCartAdvance,
    handleUpdateQuantity,
    handleRemoveItem,
    isAdminOpen,
    setIsAdminOpen,
    isMyOrdersOpen,
    setIsMyOrdersOpen,
    isGuideOpen,
    setIsGuideOpen,
    products,
    loadProducts,
    latestOrder,
    latestWhatsappMessage,
    latestWhatsappUrl,
    handleOrderSuccess,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const isCheckoutOrSuccess =
    location.pathname === '/checkout' ||
    location.pathname === '/order-confirmation' ||
    location.pathname === '/order-success' ||
    location.pathname === '/cart';

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-800 antialiased font-sans">
      <ScrollToTop />

      {/* 1. Sticky Navigation Header with Logo + Home Icon Navigation */}
      <Header
        language={language}
        setLanguage={setLanguage}
        cartCount={totalCartCount}
        cartAdvanceTotal={totalCartAdvance}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenDeploymentGuide={() => setIsGuideOpen(true)}
      />

      {/* 2. Main Page Content Routed through React Router */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderSuccessPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-confirmation/:id" element={<OrderSuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* 3. Mobile Sticky Bottom Action Bar when on Catalog pages and Cart has items */}
      {cart.length > 0 && !isCheckoutOrSuccess && (
        <div className="sticky bottom-0 z-30 bg-stone-900 text-white p-3 sm:p-4 border-t-2 border-amber-400 shadow-2xl">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative bg-amber-400 text-stone-950 p-2 sm:p-2.5 rounded-xl font-black">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-700 text-white text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-stone-900">
                  {totalCartCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] text-stone-400 block font-medium">
                  {language === 'ta' ? 'செலுத்த வேண்டிய 50% முன்பணம்' : '50% Advance to Pay'}
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400">
                  ₹{totalCartAdvance}
                </span>
                <span className="text-[11px] text-stone-400 ml-1.5 hidden sm:inline">
                  (Total: ₹{totalCartAmount})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="sticky-cart-btn"
                onClick={() => navigate('/cart')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-stone-700 active:scale-95 transition"
              >
                {language === 'ta' ? 'கூடை' : 'View Cart'}
              </button>
              <button
                type="button"
                id="sticky-checkout-btn"
                onClick={() => navigate('/checkout')}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition"
              >
                <span>{language === 'ta' ? 'ஆர்டர் செய்க' : 'Checkout'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Global Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs py-8 px-4 mt-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center justify-center sm:justify-start gap-2 text-white font-black text-lg hover:text-amber-300 transition"
              >
                <Sprout className="w-5 h-5 text-amber-400" />
                <span>Daddy&apos;s Home</span>
              </button>
              <p className="text-stone-400 text-xs">
                Fresh Farm Products from Kolli Hills • கொல்லிமலை இயற்கை பண்ணை
              </p>
              <p className="text-stone-500 text-[11px]">
                Namakkal District, Tamil Nadu - 637411 • Mountain Elevation 1300m
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Page</span>
              </button>

              <a
                href={getContactWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp Support</span>
              </a>

              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-2 rounded-xl transition flex items-center gap-1.5 font-medium text-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Guide</span>
              </button>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <span>© {new Date().getFullYear()} Daddy&apos;s Home. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="hover:text-amber-400 transition"
              >
                Home
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="hover:text-amber-400 transition"
              >
                Cart
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="hover:text-amber-400 transition"
              >
                Contact
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-amber-400 transition"
              >
                Admin Panel
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsMyOrdersOpen(true)}
                className="hover:text-amber-400 transition"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Modals for Admin, Tracking, Guide */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        language={language}
        onProductsUpdated={loadProducts}
      />

      <CustomerOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        language={language}
      />

      <DeploymentGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
