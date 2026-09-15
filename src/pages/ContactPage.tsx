import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BackToHomeButton } from '../components/BackToHomeButton';
import { translations } from '../translations';
import { ADMIN_DISPLAY_PHONE, ADMIN_RAW_PHONE, ADMIN_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { Phone, MessageCircle, MapPin, Clock, Sprout, Send, ExternalLink, ShieldCheck, Mail } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Bulk Order');
  const [message, setMessage] = useState('');

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMessage = `Hello Daddy's Home Farm!\n\nInquiry from: ${userName || 'Customer'}\nPhone: ${userPhone || 'Not provided'}\nTopic: ${inquiryType}\nMessage: ${message}`;
    const waUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Header with prominent Back to Home button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          {language === 'ta' ? 'கொல்லிமலை பண்ணை நேரடி தொடர்பு' : 'Kolli Hills Farm Direct Support'}
        </span>
      </div>

      {/* 2. Page Title */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
          <span>{language === 'ta' ? 'நேரடி பண்ணை உதவி' : 'Direct Hill Farm Contact'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {language === 'ta' ? "டாடிஸ் ஹோம் பண்ணை தொடர்பு" : "Contact Daddy's Home"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {language === 'ta'
            ? 'கொல்லிமலை மலைவாழ் விவசாயிகளிடமிருந்து புதிய இயற்கை உற்பத்திப் பொருட்களைப் பெற அழைக்கவும் அல்லது வாட்ஸ்அப் செய்யவும்.'
            : 'Get in touch with our hill family farm for bulk orders, farm visits, and fresh product inquiries.'}
        </p>
      </div>

      {/* 3. Contact Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <h2 className="font-bold text-stone-900 text-base">WhatsApp Support</h2>
            <p className="text-xs text-stone-500">
              Direct Click-to-Chat with Daddy&apos;s Home farm team.
            </p>
            <p className="text-sm font-black text-emerald-800">{ADMIN_DISPLAY_PHONE}</p>
          </div>
          <a
            href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Daddy's Home! I would like to inquire about your farm products.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition active:scale-95 shadow-xs"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Phone Call Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-stone-900 text-base">Call Directly</h2>
            <p className="text-xs text-stone-500">
              Speak directly with our Kolli Hills harvest coordinator.
            </p>
            <p className="text-sm font-black text-stone-900">{ADMIN_DISPLAY_PHONE}</p>
          </div>
          <a
            href={`tel:${ADMIN_RAW_PHONE}`}
            className="inline-flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition active:scale-95 shadow-xs"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Call {ADMIN_DISPLAY_PHONE}</span>
          </a>
        </div>

        {/* Location & Hours Card */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-stone-900 text-base">Farm Location</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kolli Hills (1300m elevation), Namakkal District, Tamil Nadu - 637411.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mon - Sun: 7:00 AM - 9:00 PM</span>
            </div>
          </div>
          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
            🌿 Direct Hill Dispatch Everyday
          </div>
        </div>
      </div>

      {/* 4. Interactive Inquiry Form */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-lg font-bold text-stone-900">
            {language === 'ta' ? 'விவசாயக் குழுவிற்கு செய்தி அனுப்பவும்' : 'Send a Direct Message to Our Farm'}
          </h2>
          <p className="text-xs text-stone-500">
            Fills a formatted inquiry message to send straight to Daddy&apos;s Home WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSendInquiry} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Your Name</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Anandha Kumar"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Mobile Number</label>
            <input
              type="tel"
              required
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="e.g. 9360145259"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-stone-700">Topic</label>
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Bulk Order">Bulk Farm Order (Turmeric / Pepper / Honey)</option>
              <option value="Order Tracking">Tracking Existing Order</option>
              <option value="50% Advance Payment Query">50% Advance Payment Query</option>
              <option value="Farm Visit">Kolli Hills Farm Visit</option>
              <option value="Other Question">Other Question</option>
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-stone-700">Your Message</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your question or request here..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 resize-none"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              id="submit-contact-inquiry-btn"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp (+91 {ADMIN_RAW_PHONE})</span>
            </button>
          </div>
        </form>
      </div>

      {/* 5. Bottom Back to Home button */}
      <div className="flex justify-center sm:justify-start">
        <BackToHomeButton label={language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Back to Home'} />
      </div>
    </div>
  );
};
