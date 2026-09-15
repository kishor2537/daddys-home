import React, { useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  PhoneCall,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../translations';
import {
  generateWhatsAppOrderMessage,
  getWhatsAppOrderUrl,
  getContactWhatsAppUrl,
  ADMIN_DISPLAY_PHONE,
} from '../utils/whatsapp';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  whatsappMessage?: string;
  whatsappUrl?: string;
  language: Language;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  order,
  whatsappMessage: initialWhatsappMessage,
  whatsappUrl: initialWhatsappUrl,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [copied, setCopied] = useState(false);

  // Generate exact WhatsApp message according to the required template
  const messageText =
    initialWhatsappMessage ||
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

  // Official WhatsApp Click-to-Chat URL
  // https://wa.me/919360145259?text=${encodeURIComponent(orderMessage)}
  const sendOrderWhatsAppUrl =
    initialWhatsappUrl ||
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

  // Second button URL: Contact Daddy's Home (+91 93601 45259)
  const contactWhatsAppUrl = getContactWhatsAppUrl();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-emerald-500 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-amber-950 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-28 h-28 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-16 h-16 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-white/20">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {t.orderConfirmed}
          </h2>
          <p className="text-xs text-amber-300 font-bold mt-1">
            {language === 'ta'
              ? '50% முன்பணம் வெற்றிகரமாக பெறப்பட்டது'
              : '50% Advance Payment Successful'}
          </p>

          <div className="inline-block bg-white/15 border border-white/20 px-4 py-1.5 rounded-full mt-3 text-xs font-mono font-bold tracking-wider">
            {t.orderNumber}: <span className="text-amber-300">{order.id}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* SUCCESS MESSAGE: Required by user */}
          <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <div className="p-1.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-950 tracking-tight">
                WhatsApp Order System
              </h4>
              <p className="text-xs text-emerald-900 font-semibold mt-0.5 leading-snug">
                Your order details have been prepared and sent to Daddy&apos;s Home WhatsApp.
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Click below to send or review your order with the farm owner at{' '}
                <strong className="font-bold">{ADMIN_DISPLAY_PHONE}</strong>.
              </p>
            </div>
          </div>

          {/* Financial & Delivery Summary Card */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-stone-600 font-medium">Customer:</span>
              <span className="font-bold text-stone-900">{order.customerName} (+91 {order.phoneNumber})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600 font-medium">Product(s):</span>
              <span className="font-bold text-stone-900 text-right max-w-xs">{order.productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600 font-medium">Quantity:</span>
              <span className="font-bold text-stone-900">{order.quantity}</span>
            </div>
            <div className="flex justify-between items-start pt-1">
              <span className="text-stone-600 font-medium shrink-0">Address:</span>
              <span className="font-medium text-stone-800 text-right ml-2">{order.deliveryAddress}</span>
            </div>

            <div className="pt-2 border-t border-amber-200 grid grid-cols-2 gap-2">
              <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-2 text-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">50% Advance Paid</span>
                <span className="text-base font-black text-emerald-900">₹{order.advancePaid}</span>
              </div>
              <div className="bg-white border border-stone-200 rounded-xl p-2 text-center">
                <span className="text-[10px] font-bold text-stone-600 uppercase block">Balance on Delivery</span>
                <span className="text-base font-black text-stone-900">₹{order.balanceDue}</span>
              </div>
            </div>
          </div>

          {/* Prepared WhatsApp Message Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Prepared WhatsApp Order Message</span>
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition border border-emerald-200"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-stone-900 text-amber-200 rounded-2xl p-4 font-mono text-xs shadow-inner leading-relaxed border border-stone-800 whitespace-pre-line select-all">
              {messageText}
            </div>
          </div>

          {/* PRIMARY BUTTON 1: "Send Order on WhatsApp" */}
          <div className="space-y-2 pt-1">
            <a
              id="send-order-whatsapp-btn"
              href={sendOrderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa51] text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2.5 transition active:scale-98 text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Send Order on WhatsApp</span>
              <ExternalLink className="w-4 h-4 text-emerald-100 ml-0.5" />
            </a>

            {/* SECOND BUTTON 2: "Contact Daddy's Home" */}
            <a
              id="contact-daddys-home-whatsapp-btn"
              href={contactWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition active:scale-98 text-center border border-stone-700"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Contact Daddy&apos;s Home ({ADMIN_DISPLAY_PHONE})</span>
            </a>
          </div>

          {/* Close & Continue Shopping */}
          <div className="pt-1">
            <button
              id="order-confirmation-close-btn"
              onClick={onClose}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>{language === 'ta' ? 'மீண்டும் பொருட்கள் வாங்க' : 'Continue Shopping'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop & Mobile Trust Note */}
          <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Works seamlessly on Android, iPhone, Windows, macOS, and WhatsApp Web.</span>
          </p>
        </div>

      </div>
    </div>
  );
};
