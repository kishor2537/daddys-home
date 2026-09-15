import React, { useState } from 'react';
import { X, Search, PackageCheck, PhoneCall, MessageSquare, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import { ADMIN_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setError(language === 'ta' ? '10-இலக்க அலைபேசி எண்ணை உள்ளிடவும்' : 'Enter a valid 10-digit mobile number');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const results = await api.getOrders(clean.slice(-10));
      setOrders(results);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to search orders');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-50 rounded-3xl max-w-lg w-full shadow-2xl border border-amber-300 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'ta' ? 'உங்கள் ஆர்டர்களைக் கண்காணிக்க' : 'Track Your Farm Order'}
              </h2>
              <p className="text-xs text-emerald-200">
                {language === 'ta' ? 'அலைபேசி எண்ணை உள்ளிட்டு ஆர்டர் விவரம் காணவும்' : 'Enter your registered 10-digit mobile number'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 9840123456"
                className="w-full pl-12 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-emerald-700"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{language === 'ta' ? 'தேடுக' : 'Search'}</span>
            </button>
          </form>
          {error && <p className="text-xs text-red-600 font-semibold mt-2">{error}</p>}
        </div>

        {/* Orders Results */}
        <div className="p-4 sm:p-5 max-h-96 overflow-y-auto space-y-3">
          {!hasSearched ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              <PackageCheck className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p>{language === 'ta' ? 'உங்கள் ஆர்டர் விவரம் காண அலைபேசி எண்ணை பதிவிடவும்' : 'Enter your mobile number above to search your order history'}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-stone-200 p-4">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-800">
                {language === 'ta' ? 'இந்த எண்ணில் ஆர்டர் எதுவும் இல்லை' : 'No orders found for this number'}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'ta' ? 'தயவுசெய்து நீங்கள் ஆர்டர் செய்த போது கொடுத்த அலைபேசி எண்ணை சரிபார்க்கவும்.' : 'Please make sure you entered the mobile number used during checkout.'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                    {order.id}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-stone-700">
                    <span className="font-medium">{language === 'ta' ? 'பொருட்கள்' : 'Items'}:</span>
                    <span className="font-bold text-stone-900">{order.productName}</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span className="font-medium">{language === 'ta' ? 'செலுத்திய 50% முன்பணம்' : '50% Advance Paid'}:</span>
                    <span className="font-bold text-emerald-700">₹{order.advancePaid}</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span className="font-medium">{language === 'ta' ? 'மீதி டெலிவரியில்' : 'Balance on Delivery'}:</span>
                    <span className="font-bold text-stone-900">₹{order.balanceDue}</span>
                  </div>
                  <div className="text-stone-500 pt-1 text-[11px]">
                    {language === 'ta' ? 'டெலிவரி முகவரி' : 'Address'}: {order.deliveryAddress}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <a
                    href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hello Daddy's Home, I would like to check on my order #${order.id}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
