import React from 'react';
import { X, BookOpen, Database, MessageCircle, CreditCard, Cloud, CheckCircle, Terminal } from 'lucide-react';
import { Language } from '../types';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Daddy&apos;s Home - Deployment & Integration Guide</h2>
              <p className="text-xs text-emerald-200">WhatsApp Click-to-Chat Order Notification & 50% Advance UPI Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* Section 1: Overview & Stack */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-700" />
              <span>1. Technology Architecture</span>
            </h3>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1 font-mono text-[11px]">
              <p><strong>Frontend:</strong> React 19, Tailwind CSS, Lucide Icons, Bilingual (Tamil & English)</p>
              <p><strong>Backend:</strong> Express Full-Stack Server on port 3000</p>
              <p><strong>Database:</strong> Orders, Products, and WhatsApp logs</p>
              <p><strong>Payments:</strong> Interactive 50% Advance UPI Deep Linking & Payment verification</p>
              <p><strong>Order Dispatch:</strong> WhatsApp Click-to-Chat protocol (Admin: 9360145259) - Zero SMS Gateway costs</p>
            </div>
          </div>

          {/* Section 2: Firestore Database Structure */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>2. Database Data Model</span>
            </h3>
            <div className="space-y-2">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="font-bold text-emerald-800">/products/{'{productId}'}</span>
                <p className="text-stone-500 mt-1">Fields: id, nameEn, nameTa, price, stock, unitEn, unitTa, imageUrl, featured, originEn, originTa</p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="font-bold text-emerald-800">/orders/{'{orderId}'}</span>
                <p className="text-stone-500 mt-1">Fields: id (e.g. DH-8491), customerName, phoneNumber, deliveryAddress, productName, quantity, totalAmount, advancePaid (50%), balanceDue (50%), paymentStatus, paymentMethod, orderStatus, whatsappMessage, whatsappUrl, createdAt</p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="font-bold text-emerald-800">/whatsappLogs/{'{logId}'}</span>
                <p className="text-stone-500 mt-1">Fields: id, orderId, adminPhone (9360145259), message, url, createdAt</p>
              </div>
            </div>
          </div>

          {/* Section 3: WhatsApp Click-to-Chat Order System */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
              <span>3. WhatsApp Click-to-Chat Order Notification</span>
            </h3>
            <p className="text-stone-600">
              When a customer confirms an order and pays the 50% advance:
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2 text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4 text-[#25D366]" />
                <span>Admin Mobile Number: +91 9360145259</span>
              </div>
              <p className="text-[11px] text-stone-600">
                The application automatically formats the complete order details and encodes it into the standard Click-to-Chat URL:
              </p>
              <code className="block bg-white p-2.5 rounded-lg border border-emerald-300 font-mono text-[10px] text-stone-900 break-all">
                https://wa.me/919360145259?text=New%20Order%20-%20Daddy's%20Home...
              </code>
            </div>
            <ul className="list-disc list-inside text-stone-600 space-y-1 pt-1">
              <li>1. No SMS gateway fees or third-party Twilio dependencies.</li>
              <li>2. Fully responsive across mobile (WhatsApp app) and desktop (WhatsApp Web).</li>
              <li>3. Customer can send order directly through WhatsApp with a single tap.</li>
              <li>4. Immediate direct communication between customer and Daddy&apos;s Home.</li>
            </ul>
          </div>

          {/* Section 4: UPI Payment Advance */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>4. 50% Advance UPI Payment</span>
            </h3>
            <p className="text-stone-600">
              Google Pay, PhonePe, Paytm, and BHIM UPI options are supported for one-click 50% advance payments with automatic balance due calculation.
            </p>
          </div>

          {/* Section 5: Production Build */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-700" />
              <span>5. Production Build & Start</span>
            </h3>
            <div className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-[11px] space-y-1">
              <p className="text-emerald-400"># Install dependencies</p>
              <p>npm install</p>
              <p className="text-emerald-400"># Build frontend & bundle server</p>
              <p>npm run build</p>
              <p className="text-emerald-400"># Launch production server</p>
              <p>npm start</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
