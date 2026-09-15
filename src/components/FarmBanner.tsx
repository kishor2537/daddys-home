import React from 'react';
import { ArrowDown, CheckCircle2, PhoneCall, ShieldCheck, Sparkles, Sprout } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { ADMIN_DISPLAY_PHONE, ADMIN_RAW_PHONE } from '../utils/whatsapp';

interface FarmBannerProps {
  language: Language;
  onShopNow: () => void;
  onOpenMyOrders: () => void;
}

export const FarmBanner: React.FC<FarmBannerProps> = ({
  language,
  onShopNow,
  onOpenMyOrders,
}) => {
  const t = translations[language];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-amber-900/90 text-white pt-8 pb-10 px-4 sm:px-6">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Main Hero Content */}
          <div className="md:col-span-7 space-y-4 text-left">
            {/* Hill Origin Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
              <Sprout className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? 'கொல்லிமலை நேரடி இயற்கை பண்ணை' : 'Direct from Kolli Hills Organic Farm'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'ta' ? (
                <>
                  கொல்லிமலையின் தூய <span className="text-amber-400">பண்ணை பொருட்கள்</span> நேரடியாக உங்கள் இல்லத்திற்கு
                </>
              ) : (
                <>
                  Fresh Hill Harvest from <span className="text-amber-400">Daddy&apos;s Home</span> Farm
                </>
              )}
            </h2>

            <p className="text-stone-200 text-sm sm:text-base max-w-xl leading-relaxed">
              {language === 'ta'
                ? 'தூய மஞ்சள் தூள், பண்ணை காடை முட்டை, அசல் நாட்டுக்கோழி முட்டை மற்றும் அடர் வாசனை கருமிளகு. கலப்படமற்ற 100% இயற்கை விளைபொருட்கள்.'
                : 'Pure Turmeric Powder, Farm Quail Eggs, Free-Range Country Hen Eggs, and Kolli Hills Black Pepper. 100% farm-fresh, free from chemicals.'}
            </p>

            {/* Key Guarantees Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-emerald-100">
                  {language === 'ta' ? '50% முன்பணம் மட்டும்' : 'Pay 50% Advance'}
                </span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-emerald-100">
                  {language === 'ta' ? 'உடனடி SMS தகவல்' : 'Instant SMS Alerts'}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-2.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-medium text-emerald-100">
                  {language === 'ta' ? '100% இயற்கை தரம்' : '100% Pure Natural'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="banner-shop-now-btn"
                onClick={onShopNow}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-base px-6 py-3.5 rounded-xl shadow-lg shadow-amber-900/30 transition transform active:scale-95"
              >
                <span>{t.shopNow}</span>
                <ArrowDown className="w-4 h-4 text-stone-900 stroke-[3]" />
              </button>

              <button
                id="banner-track-order-btn"
                onClick={onOpenMyOrders}
                className="flex items-center justify-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-3.5 rounded-xl border border-emerald-600/70 transition active:scale-95"
              >
                <span>{language === 'ta' ? 'ஆர்டர் கண்காணிக்க' : 'Track Existing Order'}</span>
              </button>

              <a
                href={`tel:${ADMIN_RAW_PHONE}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-medium px-2 py-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{ADMIN_DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Right Visual Card Showcase - Best Seller Turmeric */}
          <div className="md:col-span-5 relative mt-4 md:mt-0">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-emerald-950">
              <img
                src="/images/turmeric-powder.jpg"
                alt="Daddy's Home Kolli Hills Pure Turmeric Powder - #1 Best Seller"
                className="w-full h-64 sm:h-76 object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5 flex-wrap gap-1">
                  <span className="bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md flex items-center gap-1">
                    <span>⭐</span>
                    <span>{language === 'ta' ? '#1 சிறந்த விற்பனை' : '#1 BEST SELLER'}</span>
                  </span>
                  <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-400/40">
                    {language === 'ta' ? 'கொல்லிமலை விளைச்சல்' : 'KOLLI HILLS HARVEST'}
                  </span>
                </div>
                <h3 className="text-white font-black text-lg sm:text-xl leading-snug drop-shadow-md">
                  {language === 'ta'
                    ? 'கொல்லிமலை தூய மஞ்சள் தூள்'
                    : 'Pure Hill Turmeric Powder'}
                </h3>
                <p className="text-amber-200/90 text-xs font-medium mt-0.5">
                  {language === 'ta'
                    ? 'இயற்கை குர்குமின் நிறைந்த பாரம்பரிய தூய மஞ்சள்'
                    : 'High Curcumin • Stone Ground • Zero Chemicals'}
                </p>
              </div>
            </div>

            {/* Float Highlight Pill */}
            <div className="absolute -bottom-3 -left-3 bg-amber-400 text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5">
              <span>🏷️</span>
              <span>{language === 'ta' ? 'முன்பணம் 50% மட்டுமே' : 'Pay 50% Advance'}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
