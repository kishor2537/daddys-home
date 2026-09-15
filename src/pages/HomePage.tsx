import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { FarmBanner } from '../components/FarmBanner';
import { ProductCard } from '../components/ProductCard';
import { translations } from '../translations';
import { Sprout, ShieldCheck, Truck, Sparkles, MessageCircle, PhoneCall, Layers, ArrowRight } from 'lucide-react';
import { ADMIN_DISPLAY_PHONE } from '../utils/whatsapp';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { products, isLoadingProducts, language, handleAddToCart, cart, setIsMyOrdersOpen } = useApp();
  const t = translations[language];
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* 1. Hero Farm Banner */}
      <FarmBanner
        language={language}
        onShopNow={scrollToProducts}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
      />

      {/* 2. Products Catalog Section */}
      <main ref={productsSectionRef} className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Clean section title */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300/80 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.advanceBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {t.ourProducts}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {t.ourProductsDesc}
          </p>
        </div>

        {/* Products Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 h-96 animate-pulse p-4 space-y-4"
              >
                <div className="bg-stone-200 aspect-4/3 rounded-xl w-full" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="h-10 bg-stone-200 rounded w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => {
              const inCartQty = cart.find((item) => item.product.id === product.id)?.quantity || 0;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAddToCart={handleAddToCart}
                  cartQuantity={inCartQty}
                />
              );
            })}
          </div>
        )}

        {/* Farm Direct Quality Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="bg-emerald-900/5 border border-emerald-800/20 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-950">1300m Mountain Elevation</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Rich red volcanic soil with cool hill mist creates higher curcumin and essential oils.
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">50% Advance Guarantee</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Pay only half to confirm booking. Pay balance in cash or UPI when delivered.
              </p>
            </div>
          </div>

          <div className="bg-stone-900/5 border border-stone-800/10 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-emerald-300 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Direct From Tribal Farmers</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                No middle agents. 100% of purchase supports local hill farm families.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-emerald-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-amber-300">
              {language === 'ta' ? 'கேள்விகள் அல்லது மொத்த ஆர்டர்கள் உள்ளதா?' : 'Have Questions or Need Bulk Orders?'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              {language === 'ta'
                ? `டாடிஸ் ஹோம் வாட்ஸ்அப் வழியாக எங்களை உடனடியாக தொடர்புகொள்ளலாம்: ${ADMIN_DISPLAY_PHONE}`
                : `Contact Daddy's Home directly via WhatsApp: ${ADMIN_DISPLAY_PHONE}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>{language === 'ta' ? 'தொடர்பு பக்கம்' : 'Visit Contact Page'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
