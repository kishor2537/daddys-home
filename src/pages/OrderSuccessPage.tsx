import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BackToHomeButton } from '../components/BackToHomeButton';
import { translations } from '../translations';
import { getWhatsAppOrderUrl, getContactWhatsAppUrl, ADMIN_DISPLAY_PHONE } from '../utils/whatsapp';
import { CheckCircle2, MessageCircle, Copy, Check, PhoneCall, ShoppingBag, ArrowLeft, ExternalLink, PackageCheck, Truck } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { latestOrder, latestWhatsappMessage, latestWhatsappUrl, language } = useApp();
  const t = translations[language];

  const [hasCopied, setHasCopied] = useState(false);
  const [hasClickedWhatsApp, setHasClickedWhatsApp] = useState(false);

  // If no order exists, provide friendly empty/fallback state
  if (!latestOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="flex justify-start">
          <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        </div>
        <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
          <PackageCheck className="w-12 h-12 text-emerald-700 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">
            {language === 'ta' ? 'ஆர்டர் விபரம் இல்லை' : 'No Recent Order Found'}
          </h2>
          <p className="text-sm text-stone-600">
            {language === 'ta'
              ? 'சமீபத்திய ஆர்டர்கள் ஏதுமில்லை. பண்ணைப் பொருட்களைப் பார்க்க முகப்புக்குச் செல்லவும்.'
              : 'There are no active order confirmations to display. Return to home to browse our fresh products.'}
          </p>
          <div className="pt-2">
            <BackToHomeButton
              label={language === 'ta' ? 'முகப்புக்குச் செல்லவும்' : 'Return to Home Page'}
            />
          </div>
        </div>
      </div>
    );
  }

  // Pre-generate WhatsApp URLs
  const messageText =
    latestWhatsappMessage ||
    latestOrder.whatsappMessage ||
    `New Order - Daddy's Home\n\nOrder ID: ${latestOrder.id}\nCustomer Name: ${latestOrder.customerName}\nPhone Number: ${latestOrder.phoneNumber}\nDelivery Address: ${latestOrder.deliveryAddress}\nProduct Name: ${latestOrder.productName || 'Kolli Hills Farm Products'}\nQuantity: ${latestOrder.quantity || 1}\nTotal Amount: ₹${latestOrder.totalAmount}\nAdvance Amount Paid: ₹${latestOrder.advancePaid}`;

  const sendOrderWhatsAppUrl =
    latestWhatsappUrl ||
    latestOrder.whatsappUrl ||
    getWhatsAppOrderUrl({
      id: latestOrder.id,
      customerName: latestOrder.customerName,
      phoneNumber: latestOrder.phoneNumber,
      deliveryAddress: latestOrder.deliveryAddress,
      productName: latestOrder.productName || 'Kolli Hills Farm Products',
      quantity: latestOrder.quantity || 1,
      totalAmount: latestOrder.totalAmount,
      advancePaid: latestOrder.advancePaid,
      createdAt: latestOrder.createdAt,
    });

  // Contact Daddy's Home WhatsApp URL
  const contactWhatsAppUrl = getContactWhatsAppUrl();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    setHasClickedWhatsApp(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Top Bar with Back to Home Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Order ID: #{latestOrder.id}
        </span>
      </div>

      {/* 2. Success Banner & Details Card */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            {t.orderConfirmed}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            {t.thankYouMessage}
          </p>
        </div>

        {/* WhatsApp Notification Alert Box */}
        <div className="bg-emerald-50/90 border-2 border-[#25D366]/40 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-black text-emerald-950">
                {language === 'ta' ? 'வாட்ஸ்அப் அறிவிப்பு தயாராக உள்ளது' : 'WhatsApp Order Alert Ready'}
              </h2>
              <p className="text-xs text-stone-700 leading-relaxed">
                {t.whatsAppPreparedAlert}
              </p>
            </div>
          </div>

          {/* Primary Action Button: Send Order on WhatsApp */}
          <a
            id="send-order-whatsapp-btn"
            href={sendOrderWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa51] text-white font-black text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-98 text-center"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{t.whatsAppOrder}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {hasClickedWhatsApp && (
            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-300 text-xs text-emerald-900 font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'ta'
                  ? 'வாட்ஸ்அப் திறக்கப்பட்டது! ஆர்டர் உறுதி செய்யப்பட்டது.'
                  : 'WhatsApp opened! Your order message is ready to send.'}
              </span>
            </div>
          )}
        </div>

        {/* Structured Order Summary */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/90 space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500 font-medium">{t.orderNumber}</span>
            <span className="font-mono font-black text-stone-900">{latestOrder.id}</span>
          </div>

          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500 font-medium">{t.fullName}</span>
            <span className="font-bold text-stone-900">{latestOrder.customerName}</span>
          </div>

          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500 font-medium">{t.mobileNumber}</span>
            <span className="font-bold text-stone-900">+91 {latestOrder.phoneNumber}</span>
          </div>

          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500 font-medium">{t.deliveryAddress}</span>
            <span className="font-medium text-stone-800 text-right max-w-[60%]">
              {latestOrder.deliveryAddress}
            </span>
          </div>

          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500 font-medium">{t.totalOrderAmount}</span>
            <span className="font-bold text-stone-900">₹{latestOrder.totalAmount}</span>
          </div>

          <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
            <span>50% Advance Paid (Online)</span>
            <span className="text-base font-black">₹{latestOrder.advancePaid}</span>
          </div>

          <div className="flex justify-between text-stone-600 pt-1">
            <span>Balance Payable on Delivery</span>
            <span className="font-black text-stone-900">₹{latestOrder.balanceDue}</span>
          </div>
        </div>

        {/* Copy Message Fallback Drawer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600">
              {language === 'ta' ? 'செய்தி நகல் (Message Text)' : 'Order Message Preview'}
            </span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'நகலெடு' : 'Copy Text'}</span>
                </>
              )}
            </button>
          </div>
          <pre className="bg-stone-100 p-3 rounded-xl text-stone-800 text-[11px] font-mono whitespace-pre-wrap break-words border border-stone-200 leading-relaxed max-h-36 overflow-y-auto">
            {messageText}
          </pre>
        </div>

        {/* Requirement 6: EXACT TWO BUTTONS ON ORDER SUCCESS PAGE
            - Continue Shopping (Go to Home)
            - Contact Daddy's Home (WhatsApp)
        */}
        <div className="pt-3 border-t border-stone-200 space-y-3">
          <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider text-center">
            {language === 'ta' ? 'அடுத்த செயல்பாடுகள்' : 'Next Steps'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Button 1: Continue Shopping (Go to Home) */}
            <button
              type="button"
              id="order-success-continue-shopping-btn"
              onClick={() => navigate('/')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-98 text-center cursor-pointer border border-emerald-600"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>
                {language === 'ta' ? 'தொடர்ந்து பொருட்கள் வாங்க (முகப்பு)' : 'Continue Shopping (Go to Home)'}
              </span>
            </button>

            {/* Button 2: Contact Daddy's Home (WhatsApp) */}
            <a
              id="order-success-contact-whatsapp-btn"
              href={contactWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-98 text-center border border-stone-700"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Contact Daddy&apos;s Home (WhatsApp)</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Bottom Back to Home Button */}
      <div className="flex justify-center sm:justify-start">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
      </div>
    </div>
  );
};
