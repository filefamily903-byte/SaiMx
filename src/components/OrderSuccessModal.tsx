/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  Download,
  Mail,
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  FileText,
  Copy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';

export const OrderSuccessModal: React.FC = () => {
  const { orders, activeOrderId, setCurrentView, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'memo' | 'email'>('memo');
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const order = orders.find((o) => o.id === activeOrderId) || orders[0];

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E53935', '#F59E0B', '#10B981', '#3B82F6'],
      });
    } catch {
      // Fallback
    }
  }, []);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedOrderId(true);
    showToast(`Order ID ${order.id} copied!`, 'info');
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300">
      {/* Top Banner Success */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Thank you! Your order is placed.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          We received your <strong>150 TK upfront delivery deposit</strong>. Our verification team will verify TrxID <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">{order.transactionId}</code> within 15 minutes.
        </p>

        {/* Tab Switcher: Digital Memo vs Simulated Email */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 mt-4 border border-slate-200">
          <button
            onClick={() => setActiveTab('memo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'memo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Digital Memo / Voucher</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulated Confirmation Email</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Digital Memo / Voucher Paper */}
      {activeTab === 'memo' && (
        <div className="space-y-6">
          <div
            id="printable-memo"
            className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-dashed border-slate-300 shadow-xl relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Memo Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-6">
              <div>
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  Sai<span className="text-[#E53935]">Mx</span>
                </span>
                <span className="block text-[11px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                  Official Sales Voucher & Memo
                </span>
              </div>

              <div className="sm:text-right space-y-1">
                <div className="flex sm:justify-end items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">Order No:</span>
                  <span className="font-mono font-extrabold text-[#E53935] text-sm sm:text-base">
                    {order.id}
                  </span>
                  <button onClick={handleCopyId} className="text-slate-400 hover:text-slate-700">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Date: {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  ● Status: {order.status}
                </span>
              </div>
            </div>

            {/* Bill To & Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400">
                  Customer Information:
                </h4>
                <p className="font-bold text-slate-800 text-sm">{order.customerName}</p>
                <p className="text-slate-600">Mobile: {order.customerPhone}</p>
                {order.altPhone && <p className="text-slate-500">Alt Phone: {order.altPhone}</p>}
                <p className="text-slate-600">Email: {order.customerEmail}</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-400">
                  Delivery Destination:
                </h4>
                <p className="font-semibold text-slate-800">{order.address.street}</p>
                <p className="text-slate-600">
                  Upazila: {order.address.upazila}, District: {order.address.district}
                </p>
                {order.deliveryNotes && (
                  <p className="text-amber-800 bg-amber-50 p-1.5 rounded-lg text-[11px] italic mt-1">
                    Note: "{order.deliveryNotes}"
                  </p>
                )}
              </div>
            </div>

            {/* Payment Details Audit Bar */}
            <div className="my-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Payment Gateway</span>
                <span className="font-bold text-slate-800">{order.paymentMethod} Manual Transfer</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Sender Mobile</span>
                <span className="font-mono font-bold text-slate-800">{order.senderPhone}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Transaction ID (TrxID)</span>
                <span className="font-mono font-bold text-[#E53935]">{order.transactionId}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto my-6">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Unit Price</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3">
                        <p className="font-bold text-slate-800">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                          {item.selectedColor ? ` | Color: ${item.selectedColor}` : ''}
                        </p>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-700">{item.quantity}</td>
                      <td className="py-3 text-right text-slate-600">{formatTaka(item.product.price)}</td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        {formatTaka(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation Totals */}
            <div className="border-t-2 border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
              <div className="text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Important Delivery Notes:</p>
                <p>• Retain this digital voucher until goods are delivered and inspected.</p>
                <p>• Delivery partner will collect exactly {formatTaka(order.remainingDueCOD)} upon delivery.</p>
                <p>• 24/7 Support Hotline: 01735126250</p>
              </div>

              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Product Subtotal:</span>
                  <span className="font-semibold text-slate-800">{formatTaka(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatTaka(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-slate-800">{formatTaka(order.deliveryChargePaid)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-bold border border-emerald-200">
                  <span>Upfront Paid ({order.paymentMethod}):</span>
                  <span>-{formatTaka(order.deliveryChargePaid)}</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-baseline font-black">
                  <span className="text-slate-900">Cash on Delivery (Due):</span>
                  <span className="text-base text-[#E53935]">{formatTaka(order.remainingDueCOD)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Download / Print PDF Invoice</span>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#E53935] hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: Simulated Automated Email Confirmation */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-xs">
          {/* Simulated Email Client Bar */}
          <div className="bg-slate-800 text-slate-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-red-400" />
              <span className="font-semibold">Simulated Inbox Notification • Mail Delivery System</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">To: {order.customerEmail}</span>
          </div>

          <div className="p-6 sm:p-8 space-y-4 leading-relaxed text-slate-700">
            <div className="border-b border-slate-100 pb-3">
              <p className="text-xs text-slate-400">Subject:</p>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Order Confirmed! Your SaiMx Order {order.id} is being processed
              </h3>
            </div>

            <p>
              Dear <strong>{order.customerName}</strong>,
            </p>
            <p>
              Thank you for shopping at <strong>SaiMx</strong>! We have received your order and registered your <strong>150 TK upfront delivery deposit</strong> made via <strong>{order.paymentMethod}</strong> (Transaction ID: <span className="font-mono font-bold text-[#E53935]">{order.transactionId}</span>).
            </p>

            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <h4 className="font-black text-slate-900 text-xs">Order Overview:</h4>
              <p>• <strong>Order Number:</strong> {order.id}</p>
              <p>• <strong>Registered Mobile:</strong> {order.customerPhone}</p>
              <p>• <strong>Delivery Address:</strong> {order.address.street}, {order.address.upazila}, {order.address.district}</p>
              <p>• <strong>Items Ordered:</strong> {order.items.map((i) => `${i.product.name} (Qty: ${i.quantity})`).join(', ')}</p>
              <p>• <strong>Total Product Price:</strong> {formatTaka(order.subtotal)}</p>
              <p>• <strong>Remaining Cash on Delivery (COD):</strong> <span className="font-bold text-[#E53935]">{formatTaka(order.remainingDueCOD)}</span></p>
            </div>

            <p>
              Our verification team will confirm your payment within 15 minutes. Once confirmed, your parcel will be handed over to our express courier partner (Pathao / Steadfast) for doorstep delivery.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">Warm regards,<br />SaiMx Customer Fulfillment Operations</span>
              <button
                onClick={() => setCurrentView('profile')}
                className="px-4 py-2 bg-[#E53935] text-white rounded-xl font-bold text-xs hover:bg-red-700"
              >
                Track Order →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
