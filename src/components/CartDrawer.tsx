import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { CartItem, Language } from '../types';
import { translations } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const advanceAmount = Math.round(totalAmount * 0.5);
  const balanceAmount = totalAmount - advanceAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 shadow-2xl flex flex-col justify-between border-l border-amber-200">
          
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">{t.cartTitle}</h2>
              <span className="bg-amber-400 text-stone-950 font-black text-xs px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
              aria-label="Close Cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">{t.emptyCart}</h3>
                <p className="text-sm text-stone-500 max-w-xs mx-auto">
                  {t.emptyCartDesc}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-800 transition"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemSubtotal = item.product.price * item.quantity;
                const itemAdvance = Math.round(itemSubtotal * 0.5);

                return (
                  <div
                    key={item.product.id}
                    id={`cart-item-${item.product.id}`}
                    className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs flex items-center gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.nameEn}
                      className="w-16 h-16 object-cover rounded-lg bg-amber-50 shrink-0 border border-stone-100"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {language === 'ta' ? item.product.nameTa : item.product.nameEn}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {language === 'ta' ? item.product.unitTa : item.product.unitEn} • ₹{item.product.price}
                      </p>

                      {/* Advance callout */}
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {language === 'ta' ? `முன்பணம்: ₹${itemAdvance}` : `50% Advance: ₹${itemAdvance}`}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-stone-600 hover:bg-stone-200 active:bg-stone-300 rounded-l transition"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-black text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-stone-600 hover:bg-stone-200 active:bg-stone-300 rounded-r transition disabled:opacity-40"
                            aria-label="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-stone-900 ml-auto">
                          ₹{itemSubtotal}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-stone-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with 50% Advance Calculation & Checkout button */}
          {items.length > 0 && (
            <div className="bg-white border-t border-amber-200 p-4 shadow-lg space-y-3">
              {/* Calculations Box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>{t.totalOrderAmount}</span>
                  <span className="font-semibold text-stone-900 text-sm">₹{totalAmount}</span>
                </div>

                {/* 50% Advance Highlight */}
                <div className="flex justify-between items-center bg-emerald-100/90 text-emerald-900 font-bold px-3 py-2 rounded-lg border border-emerald-300">
                  <span className="text-xs">{t.advancePayableNow}</span>
                  <span className="text-lg font-black text-emerald-800">₹{advanceAmount}</span>
                </div>

                {/* Balance on Delivery */}
                <div className="flex justify-between text-xs text-stone-600 pt-1">
                  <span>{t.balancePayableOnDelivery}</span>
                  <span className="font-bold text-stone-700">₹{balanceAmount}</span>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-amber-900 font-medium pt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    {language === 'ta'
                      ? '50% முன்பணம் செலுத்தி ஆர்டரை உறுதி செய்யவும். மீதி ₹' + balanceAmount + ' பொருட்களை பெற்றுக் கொள்ளும்போது செலுத்தலாம்.'
                      : 'Pay 50% advance now. The balance of ₹' + balanceAmount + ' is paid in cash or UPI at delivery.'}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full h-12 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98"
              >
                <span>{t.proceedToCheckout}</span>
                <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded text-xs font-black">
                  ₹{advanceAmount}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {language === 'ta'
                    ? 'பாதுகாப்பான UPI கட்டணம் • உடனடி SMS உறுதி'
                    : '100% Safe UPI Advance • Instant SMS Confirmation'}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
