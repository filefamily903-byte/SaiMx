/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageCircle, ExternalLink, X, PhoneCall, Clock } from 'lucide-react';

export const WhatsAppSupportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = '8801735126250';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Salam SaiMx Support! I need assistance with an order/inquiry.'
  )}`;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {/* Floating WhatsApp trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all transform hover:scale-105"
          aria-label="WhatsApp Live Support"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">WhatsApp Help</span>
        </button>
      )}

      {/* WhatsApp Popover Card */}
      {isOpen && (
        <div className="w-[300px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-xs">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-xs font-black">SaiMx WhatsApp Support</h4>
                <p className="text-[10px] text-emerald-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Typically replies in 5 mins</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 text-xs text-slate-700 bg-[#FDFBF7]">
            <p className="leading-relaxed">
              Have a question about your <strong>150 TK upfront delivery payment</strong>, bKash verification, or parcel tracking?
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-600">
                <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Direct WhatsApp: <strong>+880 1735-126250</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Available: Daily 9:00 AM - 11:00 PM</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-md transition-all"
            >
              <span>Start WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
