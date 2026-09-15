import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BackToHomeButton } from '../components/BackToHomeButton';
import { translations } from '../translations';
import { api } from '../services/api';
import { PaymentMethod } from '../types';
import { ADMIN_DISPLAY_PHONE } from '../utils/whatsapp';
import { ShieldCheck, MessageCircle, AlertCircle, ShoppingBag, Check, Smartphone, Layers } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalCartAmount, totalCartAdvance, language, handleOrderSuccess } = useApp();
  const t = translations[language];

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Google Pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const balanceAmount = totalCartAmount - totalCartAdvance;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="flex justify-start">
          <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        </div>
        <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
          <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">
            {language === 'ta' ? 'உங்கள் கூடை காலியாக உள்ளது' : 'Your Basket is Empty'}
          </h2>
          <p className="text-sm text-stone-600">
            {language === 'ta'
              ? 'செக் அவுட் செய்ய முதலில் பொருட்களைக் கூடையில் சேர்க்கவும்.'
              : 'Add some fresh farm products to your basket before checking out.'}
          </p>
          <div className="pt-2">
            <BackToHomeButton label={language === 'ta' ? 'பொருட்களைப் பார்க்க முகப்புக்குச் செல்லவும்' : 'Back to Home to Browse Products'} />
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
      const orderPayload = {
        customerName: customerName.trim(),
        phoneNumber: cleanPhone.slice(-10),
        deliveryAddress: deliveryAddress.trim(),
        items: cart.map((i) => ({
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
      handleOrderSuccess(result.order, result.whatsappMessage, result.whatsappUrl);
      navigate('/order-confirmation');
    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to place order. Please check connection and try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Top Bar with Back to Home Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          {language === 'ta' ? 'பாதுகாப்பான செக் அவுட்' : 'Secure 50% Advance Checkout'}
        </span>
      </div>

      {/* 2. Checkout Form Container */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 border-b border-emerald-800">
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t.checkoutTitle}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            {t.checkoutSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 50% Advance Highlight Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-900 font-bold uppercase tracking-wider">
                {language === 'ta' ? 'முன்பணம் மட்டும்' : '50% Advance Required'}
              </span>
              <span className="text-lg font-black text-emerald-800">
                ₹{totalCartAdvance}
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {t.advanceNote
                .replace('{amount}', totalCartAdvance.toString())
                .replace('{balance}', balanceAmount.toString())}
            </p>
          </div>

          {/* Customer Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
              {t.fullName} *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t.fullNamePlaceholder}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
              {t.mobileNumber} *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={t.mobileNumberPlaceholder}
                className="w-full pl-14 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition tracking-wide"
              />
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-0.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.mobileHint}</span>
            </p>
          </div>

          {/* Delivery Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
              {t.deliveryAddress} *
            </label>
            <textarea
              required
              rows={3}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder={t.deliveryAddressPlaceholder}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition resize-none"
            />
          </div>

          {/* UPI Method Selection */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-800" />
              <span>{t.selectPaymentApp}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Google Pay', 'PhonePe', 'Paytm', 'UPI / QR'] as PaymentMethod[]).map((app) => (
                <button
                  type="button"
                  key={app}
                  onClick={() => setPaymentMethod(app)}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition active:scale-95 cursor-pointer ${
                    paymentMethod === app
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>{app}</span>
                  {paymentMethod === app && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Items Summary Micro-List */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'ta' ? 'ஆர்டர் செய்யும் பொருட்கள்' : 'Items in this order'}:</span>
            </span>
            <div className="divide-y divide-stone-200">
              {cart.map((i) => (
                <div key={i.product.id} className="py-1.5 flex justify-between text-stone-600">
                  <span>
                    {language === 'ta' ? i.product.nameTa : i.product.nameEn} × {i.quantity}
                  </span>
                  <span className="font-bold text-stone-900">₹{i.product.price * i.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              id="confirm-checkout-pay-btn"
              disabled={isProcessing}
              className="w-full h-14 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.processingPayment}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>{t.payAndConfirm.replace('{amount}', totalCartAdvance.toString())}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-center text-xs text-stone-500">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {language === 'ta'
                  ? `ஆர்டர் விவரங்கள் ${ADMIN_DISPLAY_PHONE} வாட்ஸ்அப்பிற்கு அனுப்பப்படும்`
                  : `Order details prepared for Daddy's Home WhatsApp (${ADMIN_DISPLAY_PHONE})`}
              </span>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Bottom Back to Home Button */}
      <div className="flex justify-center sm:justify-start">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
      </div>
    </div>
  );
};
