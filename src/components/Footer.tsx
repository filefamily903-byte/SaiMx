/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, categories, setSelectedCategoryId } = useApp();
  const [activePolicy, setActivePolicy] = useState<
    'terms' | 'privacy' | 'returns' | 'contact' | null
  >(null);

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
      {/* Upper Footer: Brand & Link columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                Sai<span className="text-[#E53935]">Mx</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-[#E53935]" />
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              SaiMx is Bangladesh's trusted lifestyle and essentials e-commerce destination. We bring you hand-picked festive wear, pure honey, natural wood-pressed oils, and top-tier electronics with guaranteed authenticity.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-[#E53935]" />
                <span>Customer Hotline: <strong>01735126250</strong> (9 AM - 11 PM)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="w-4 h-4 text-[#E53935]" />
                <span>Support: support@saimx.com</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#E53935]" />
                <span>Gulshan-2, Dhaka-1212, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Our Collections</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategoryId(c.id);
                      setCurrentView('home');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {c.displayName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActivePolicy('returns')}
                  className="hover:text-white transition-colors"
                >
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Us & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Upfront Model & Courier Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Payment & Delivery</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pay 150 TK delivery fee upfront via bKash or Nagad to confirm. Remaining balance paid Cash on Delivery.
            </p>

            {/* Payment Partner Logos */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-[#E2136E] text-white text-[10px] font-black">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#F7941D] text-white text-[10px] font-black">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700">
                Cash on Delivery
              </span>
            </div>

            <div className="pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Courier Partners:
              </span>
              <div className="flex gap-2 text-xs text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Pathao</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Steadfast</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">RedX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 SaiMx Bangladesh. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setCurrentView('admin')} className="hover:text-slate-300">
              Admin Portal
            </button>
            <span>•</span>
            <span>Security: 256-bit SSL</span>
          </div>
        </div>
      </div>

      {/* Policy & Contact Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-800 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {activePolicy === 'returns' && 'Return & Refund Policy'}
                {activePolicy === 'terms' && 'Terms & Conditions'}
                {activePolicy === 'privacy' && 'Privacy Policy'}
                {activePolicy === 'contact' && 'Contact Us & Head Office Map'}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              {activePolicy === 'returns' && (
                <>
                  <p>
                    <strong>1. 7-Day Replacement Guarantee:</strong> If you receive a defective, damaged, or mismatched product, notify us within 7 days of delivery.
                  </p>
                  <p>
                    <strong>2. Delivery Charge Policy:</strong> The upfront 150 TK delivery charge covers return pickup in case of verified defects.
                  </p>
                  <p>
                    <strong>3. Refund Processing:</strong> Full refunds are sent directly to your original bKash or Nagad wallet within 24 hours of receiving the returned item.
                  </p>
                </>
              )}

              {activePolicy === 'terms' && (
                <>
                  <p>
                    <strong>1. Order Acceptance:</strong> Orders placed on SaiMx are confirmed once the 150 TK delivery fee is verified against merchant statement (01735126250).
                  </p>
                  <p>
                    <strong>2. Cash on Delivery (COD):</strong> Customers agree to pay the remaining product cost upon doorstep parcel handover.
                  </p>
                  <p>
                    <strong>3. Delivery Timelines:</strong> Dhaka 24-48 hours; all other 63 districts 2-4 business days.
                  </p>
                </>
              )}

              {activePolicy === 'privacy' && (
                <>
                  <p>
                    <strong>1. Data Protection:</strong> We store your name, mobile number, and address strictly for courier dispatch and invoice generation.
                  </p>
                  <p>
                    <strong>2. Payment Privacy:</strong> SaiMx does not store your bKash or Nagad personal PINs. You execute manual transfers safely inside your own provider app.
                  </p>
                </>
              )}

              {activePolicy === 'contact' && (
                <div className="space-y-3">
                  <p>
                    <strong>SaiMx Bangladesh Headquarters:</strong>
                    <br />
                    Level 8, Tower 42, Road 11, Gulshan-2, Dhaka-1212
                  </p>
                  <p>
                    <strong>Helpline:</strong> 01735126250
                    <br />
                    <strong>Email:</strong> support@saimx.com
                  </p>

                  {/* Embedded Map Representation */}
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-4 text-center">
                    <div className="aspect-16/9 bg-slate-200 rounded-xl flex flex-col items-center justify-center p-4">
                      <MapPin className="w-8 h-8 text-[#E53935] mb-2 animate-bounce" />
                      <p className="font-bold text-slate-800 text-xs">Gulshan-2 Circle, Dhaka</p>
                      <p className="text-[10px] text-slate-500">23.7925° N, 90.4078° E</p>
                      <span className="mt-2 text-[10px] bg-white px-2.5 py-1 rounded-full font-semibold text-slate-700 shadow-2xs">
                        Open Mon-Sat (9:00 AM - 8:00 PM)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActivePolicy(null)}
              className="w-full py-2.5 bg-[#E53935] text-white rounded-xl text-xs font-bold hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
