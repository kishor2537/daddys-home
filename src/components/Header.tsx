import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Languages, PackageCheck, Sprout, Home, Phone } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  cartAdvanceTotal: number;
  onOpenCart?: () => void;
  onOpenAdmin: () => void;
  onOpenMyOrders: () => void;
  onOpenDeploymentGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  cartCount,
  onOpenAdmin,
  onOpenMyOrders,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      {/* Top micro banner */}
      <div className="bg-amber-600 text-amber-950 font-medium text-xs py-1 px-3 text-center flex items-center justify-center gap-2">
        <span className="font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
          {language === 'ta' ? '50% முன்பணம்' : '50% Advance'}
        </span>
        <span>
          {language === 'ta'
            ? 'அனைத்து ஆர்டர்களுக்கும் 50% முன்பணம் மட்டும் செலுத்தவும். மீதி டெலிவரியில்!'
            : 'Pay only 50% advance now to confirm your order. Balance on delivery!'}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo & Name - Clicking returns to Home Page */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl p-1 -m-1 transition active:scale-98 cursor-pointer"
          title="Return to Home Page"
          aria-label="Daddy's Home - Return to Home"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-emerald-950 flex items-center justify-center shadow-inner font-extrabold text-xl ring-2 ring-amber-300/40 shrink-0">
            <Sprout className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-sans flex items-center gap-1.5">
                {t.brandName}
              </span>
              <span className="hidden sm:inline-block bg-emerald-700/80 text-amber-300 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-600">
                Kolli Hills
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-emerald-200 font-medium line-clamp-1">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Requirement 4: Mobile & Desktop Home Icon Button */}
          <button
            id="header-home-btn"
            type="button"
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 font-bold px-2.5 sm:px-3 py-1.5 rounded-lg border transition text-xs sm:text-sm active:scale-95 cursor-pointer min-h-[38px] ${
              isHome
                ? 'bg-emerald-950/90 text-amber-300 border-amber-400/50 shadow-inner ring-1 ring-amber-400/30'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-700'
            }`}
            title="Home / முகப்பு"
            aria-label="Go to Home"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </span>
          </button>

          {/* Contact Page Link */}
          <button
            id="header-contact-btn"
            type="button"
            onClick={() => navigate('/contact')}
            className={`hidden md:flex items-center gap-1.5 font-bold px-2.5 py-1.5 rounded-lg border transition text-xs active:scale-95 cursor-pointer ${
              location.pathname === '/contact'
                ? 'bg-emerald-950 text-amber-300 border-amber-400/50'
                : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border-emerald-700'
            }`}
            title="Contact Farm / தொடர்பு"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ta' ? 'தொடர்பு' : 'Contact'}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="lang-toggle-btn"
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold px-2 sm:px-2.5 py-1.5 rounded-lg border border-emerald-700 transition text-xs active:scale-95 cursor-pointer min-h-[38px]"
            title="Change Language / மொழி மாற்றுக"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Track Orders Button */}
          <button
            id="track-orders-btn"
            type="button"
            onClick={onOpenMyOrders}
            className="hidden lg:flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg border border-emerald-700 transition text-xs font-semibold active:scale-95 cursor-pointer"
          >
            <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ta' ? 'ஆர்டர்கள்' : 'Orders'}</span>
          </button>

          {/* Admin Panel Button */}
          <button
            id="admin-panel-btn"
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1 bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 hover:text-white px-2 sm:px-2.5 py-1.5 rounded-lg border border-emerald-800 transition text-xs font-medium active:scale-95 cursor-pointer min-h-[38px]"
            title="Admin Login & Inventory"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{language === 'ta' ? 'அட்மின்' : 'Admin'}</span>
          </button>

          {/* Cart Button -> Navigates to /cart */}
          <button
            id="header-cart-btn"
            type="button"
            onClick={() => navigate('/cart')}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl shadow-md transition active:scale-95 cursor-pointer min-h-[38px]"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
            <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wide">
              {language === 'ta' ? 'கூடை' : 'Cart'}
            </span>
            {cartCount > 0 && (
              <span className="bg-emerald-900 text-amber-300 text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
