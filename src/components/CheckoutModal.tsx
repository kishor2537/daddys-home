import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, MapPin, User, ArrowRight, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { CartItem, Language, PaymentMethod, Order } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import { ADMIN_DISPLAY_PHONE } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  onOrderSuccess: (order: Order, whatsappMessage: string, whatsappUrl: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  language,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Google Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculations
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const advanceAmount = Math.round(totalAmount * 0.5);
  const balanceAmount = totalAmount - advanceAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (!customerName.trim()) {
      setErrorMessage(language === 'ta' ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.' : 'Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage(language === 'ta' ? 'சரியான 10-இலக்க அலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 8) {
      setErrorMessage(language === 'ta' ? 'பொருட்கள் வந்து சேர முழு முகவரியை உள்ளிடவும்.' : 'Please provide complete delivery address with village/town.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order via API (which prepares WhatsApp order details & updates stock)
      const orderPayload = {
        customerName: customerName.trim(),
        phoneNumber: cleanPhone.slice(-10),
        deliveryAddress: deliveryAddress.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          nameEn: i.product.nameEn,
          nameTa: i.product.nameTa,
          quantity: i.quantity,
          price: i.product.price,
          unit: i.product.unitEn,
        })),
        paymentMethod,
      };

      const result = await api.createOrder(orderPayload);
      setIsProcessing(false);
      onOrderSuccess(result.order, result.whatsappMessage, result.whatsappUrl);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to place order. Please check connection and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative bg-stone-50 rounded-2xl max-w-lg w-full shadow-2xl border border-amber-300 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-white">{t.checkoutTitle}</h2>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">{t.checkoutSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 50% Advance Summary Banner */}
        <div className="bg-amber-100/90 border-b border-amber-300/80 px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-950 font-bold block uppercase tracking-wide">
              {language === 'ta' ? 'செலுத்த வேண்டிய 50% முன்பணம்' : '50% Advance Payable Now'}
            </span>
            <span className="text-xl font-black text-amber-900">₹{advanceAmount}</span>
            <span className="text-[11px] text-amber-800 ml-1.5">
              ({language === 'ta' ? `மொத்த ஆர்டர்: ₹${totalAmount}` : `Total Order: ₹${totalAmount}`})
            </span>
          </div>
          <div className="bg-emerald-800 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">
            {language === 'ta' ? `மீதி ₹${balanceAmount} டெலிவரியில்` : `Balance ₹${balanceAmount} on Delivery`}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-xs sm:text-sm font-semibold p-3 rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* 1. Customer Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-700" />
              <span>{t.fullName}</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customer-name-input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              required
              className="w-full px-3.5 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 font-medium text-stone-900 shadow-inner"
            />
          </div>

          {/* 2. Mobile Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>{t.mobileNumber}</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm font-bold">
                +91
              </span>
              <input
                type="tel"
                id="customer-phone-input"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={t.mobileNumberPlaceholder}
                required
                className="w-full pl-12 pr-3.5 py-3 text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 font-bold text-stone-900 shadow-inner tracking-wide"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              {language === 'ta'
                ? 'ஆர்டர் உறுதிப்படுத்தல் வாட்ஸ்அப் வழியாக அனுப்பப்படும்'
                : 'Order confirmation and updates will be prepared on WhatsApp'}
            </p>
          </div>

          {/* 3. Delivery Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{t.deliveryAddress}</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="customer-address-input"
              rows={2}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder={t.deliveryAddressPlaceholder}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 font-medium text-stone-900 shadow-inner"
            />
          </div>

          {/* 4. Products Ordered Summary */}
          <div className="bg-stone-100/80 border border-stone-200 rounded-xl p-3 text-xs space-y-1">
            <span className="font-bold text-stone-700 block">
              {language === 'ta' ? 'ஆர்டர் சுருக்கம்' : 'Selected Products'}:
            </span>
            <div className="divide-y divide-stone-200">
              {items.map((i) => (
                <div key={i.product.id} className="py-1 flex justify-between text-stone-600">
                  <span>
                    {language === 'ta' ? i.product.nameTa : i.product.nameEn} × {i.quantity}
                  </span>
                  <span className="font-semibold text-stone-900">₹{i.product.price * i.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Payment Method Selection */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-stone-800 block">
              {t.selectPaymentApp}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Google Pay', label: 'Google Pay' },
                { name: 'PhonePe', label: 'PhonePe' },
                { name: 'Paytm', label: 'Paytm UPI' },
                { name: 'Razorpay', label: 'Razorpay / Cards' },
              ].map((m) => (
                <button
                  key={m.name}
                  type="button"
                  id={`payment-method-${m.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setPaymentMethod(m.name as PaymentMethod)}
                  className={`p-2.5 rounded-xl border-2 text-xs font-bold flex items-center justify-between transition active:scale-95 ${
                    paymentMethod === m.name
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/30'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{m.label}</span>
                  {paymentMethod === m.name && (
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pay and Confirm Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="confirm-payment-btn"
              disabled={isProcessing}
              className="w-full h-14 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.processingPayment}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>
                    {language === 'ta'
                      ? `₹${advanceAmount} முன்பணம் செலுத்தி உறுதி செய்க`
                      : `Pay ₹${advanceAmount} (50% Advance) & Confirm`}
                  </span>
                  <ArrowRight className="w-5 h-5 text-amber-300" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-500 mt-2 flex items-center justify-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === 'ta'
                  ? `ஆர்டர் விவரங்கள் வாட்ஸ்அப் வழியாக ${ADMIN_DISPLAY_PHONE} எண்ணுக்கு அனுப்பப்படும்`
                  : `Order details prepared for Daddy's Home WhatsApp (${ADMIN_DISPLAY_PHONE})`}
              </span>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
