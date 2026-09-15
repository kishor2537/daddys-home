import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BackToHomeButton } from '../components/BackToHomeButton';
import { translations } from '../translations';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, handleUpdateQuantity, handleRemoveItem, totalCartAmount, totalCartAdvance, language } = useApp();
  const t = translations[language];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const balanceAmount = totalCartAmount - totalCartAdvance;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Header with prominent Back to Home button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-800" />
          <h1 className="text-lg sm:text-xl font-black text-stone-900">
            {language === 'ta' ? 'உங்கள் பண்ணை கூடை' : 'Your Shopping Cart'}
          </h1>
          {totalCartCount > 0 && (
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full">
              {totalCartCount} {language === 'ta' ? 'பொருட்கள்' : 'items'}
            </span>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-amber-200/80 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {t.emptyCart}
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            {t.emptyCartDesc}
          </p>
          <div className="pt-4">
            <BackToHomeButton
              label={language === 'ta' ? 'பொருட்களைப் பார்க்க முகப்புக்குத் திரும்பு' : 'Back to Home to Start Shopping'}
              className="py-3 px-6 text-sm"
            />
          </div>
        </div>
      ) : (
        /* Cart Items & Summary Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              const itemAdvance = Math.round(itemTotal * 0.5);

              return (
                <div
                  key={item.product.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Image & Product Info */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.nameEn}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-amber-50 border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                        {language === 'ta' ? item.product.nameTa : item.product.nameEn}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {language === 'ta' ? item.product.unitTa : item.product.unitEn} • ₹{item.product.price}
                      </p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {language === 'ta' ? `50% முன்பணம்: ₹${itemAdvance}` : `50% Advance: ₹${itemAdvance}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition font-bold"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 sm:w-9 text-center font-black text-stone-900 text-sm select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-stone-700 hover:bg-stone-200 disabled:opacity-40 transition font-bold"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-sm sm:text-base font-black text-stone-900 block">
                        ₹{itemTotal}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        (₹{itemAdvance} adv)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition rounded-lg hover:bg-red-50"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Back to Home Button in Left Column */}
            <div className="pt-2 flex justify-start">
              <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு (மேலும் வாங்க)' : 'Back to Home (Add More Items)'} />
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="space-y-4">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-stone-900 text-base">
                  {t.cartSummary}
                </h3>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>{t.totalOrderAmount}</span>
                  <span className="font-bold text-stone-900">₹{totalCartAmount}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  <div>
                    <span className="font-bold block">{t.advancePayableNow}</span>
                    <span className="text-[10px] text-emerald-700">Only 50% needed to confirm order</span>
                  </div>
                  <span className="font-black text-lg text-emerald-800">₹{totalCartAdvance}</span>
                </div>

                <div className="flex justify-between text-stone-600 pt-1">
                  <span>{t.balancePayableOnDelivery}</span>
                  <span className="font-bold text-stone-900">₹{balanceAmount}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {language === 'ta'
                    ? 'கொல்லிமலை பண்ணையிலிருந்து நேரடியாக பேக் செய்யப்பட்டு அனுப்பப்படும்.'
                    : 'Dispatched directly from Kolli Hills organic farms.'}
                </span>
              </div>

              <button
                type="button"
                id="cart-proceed-checkout-btn"
                onClick={() => navigate('/checkout')}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>{t.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-900 text-white p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Risk 50% Advance Model</span>
              </div>
              <p className="text-emerald-100 text-[11px] leading-relaxed">
                Pay only 50% now via UPI deep link or QR. Remaining 50% is collected only when your fresh products arrive safely at your doorstep!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
