/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Copy,
  Check,
  Lock,
  ArrowLeft,
  Info,
  AlertCircle,
  Truck,
  CreditCard,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  formatTaka,
  isValidBangladeshiPhone,
  isValidTrxId,
  MERCHANT_BKASH_NAGAD_NUMBER,
} from '../utils/pricing';
import { BANGLADESH_DISTRICTS } from '../data/mockData';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartFinancials,
    currentUser,
    placeOrder,
    setCurrentView,
    showToast,
  } = useApp();

  // Step 1: Customer & Delivery Details
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [altPhone, setAltPhone] = useState(currentUser?.altPhone || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Dhaka');
  const [upazila, setUpazila] = useState(currentUser?.address?.upazila || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Step 2: Manual Payment Gateway
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [copiedMerchant, setCopiedMerchant] = useState(false);

  // Auto-fill if user logs in during flow
  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone) {
        setPhone(currentUser.phone);
        setSenderPhone(currentUser.phone);
      }
      if (!altPhone && currentUser.altPhone) setAltPhone(currentUser.altPhone);
      if (currentUser.district) setDistrict(currentUser.district);
      if (currentUser.address?.upazila && !upazila) setUpazila(currentUser.address.upazila);
      if (currentUser.address?.street && !street) setStreet(currentUser.address.street);
    }
  }, [currentUser]);

  // Form Validation checks
  const isNameValid = name.trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = isValidBangladeshiPhone(phone);
  const isStreetValid = street.trim().length >= 5;
  const isUpazilaValid = upazila.trim().length >= 2;
  const isStep1Valid = isNameValid && isEmailValid && isPhoneValid && isStreetValid && isUpazilaValid && agreedTerms;

  // Payment Validation
  const isSenderPhoneValid = isValidBangladeshiPhone(senderPhone);
  const isTrxIdValid = isValidTrxId(transactionId);
  const canSubmitOrder = isStep1Valid && isSenderPhoneValid && isTrxIdValid;

  const handleCopyMerchant = () => {
    navigator.clipboard.writeText(MERCHANT_BKASH_NAGAD_NUMBER);
    setCopiedMerchant(true);
    showToast(`Merchant number ${MERCHANT_BKASH_NAGAD_NUMBER} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedMerchant(false), 3000);
  };

  const handleQuickTrxFill = () => {
    const prefix = paymentMethod === 'bKash' ? 'BK' : 'NGD';
    const sampleTrx = `${prefix}${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTransactionId(sampleTrx);
    showToast(`Auto-filled sample TrxID for testing: ${sampleTrx}`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitOrder) {
      showToast('Please fulfill all required fields and valid TrxID', 'error');
      return;
    }

    placeOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      altPhone,
      address: { street, upazila, district },
      deliveryNotes,
      paymentMethod,
      senderPhone,
      transactionId: transactionId.trim().toUpperCase(),
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#E53935] flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your bag is empty</h2>
        <p className="text-sm text-slate-500">Add items from the store before checking out.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 bg-[#E53935] text-white rounded-full font-bold text-xs hover:bg-red-700 transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('home')}
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-[#E53935] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Payment Steps */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address & Customer Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Customer & Delivery Information
                </h3>
              </div>
              <span className="text-xs text-slate-400">Step 1 of 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
                {!isNameValid && name.length > 0 && (
                  <p className="text-[10px] text-red-500">Name must be at least 3 characters</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">E-mail Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rafiqul@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Mobile Number (BD) *</label>
                  <span className="text-[10px] text-slate-400">11 digits (013-019)</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
                {!isPhoneValid && phone.length > 0 && (
                  <p className="text-[10px] text-red-500">Must be a valid Bangladeshi number (e.g., 01711223344)</p>
                )}
              </div>

              {/* Alternative Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alternative Number (Optional)</label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="e.g. 01811223344"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                >
                  {BANGLADESH_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila / Police Station */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Upazila / Thana / Area *</label>
                <input
                  type="text"
                  required
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder="e.g. Banani / Dhanmondi"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>
            </div>

            {/* Street / Full Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Present Street Address (House, Road, Block) *</label>
              <textarea
                required
                rows={2}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. House #42, Road #11, Block D, Banani, Dhaka-1213"
                className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>

            {/* Delivery Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Delivery Notes / Special Instructions</label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Call before coming, leave with security guard, etc."
                className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>

            {/* Mandatory Terms & Conditions Checkbox */}
            <div className="pt-2 flex items-start space-x-2.5">
              <input
                id="terms-check"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#E53935] focus:ring-[#E53935]"
              />
              <label htmlFor="terms-check" className="text-xs text-slate-600 leading-normal select-none cursor-pointer">
                I agree to the <span className="font-semibold text-slate-900">Terms & Conditions</span>, Return & Refund Policy, and understand that the <strong>150 TK delivery charge is paid upfront</strong> to confirm shipment dispatch.
              </label>
            </div>
          </div>

          {/* STEP 2: Manual Payment Gateway Step (Unlocks after step 1 validation) */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
              isStep1Valid
                ? 'bg-white border-red-200 shadow-md ring-2 ring-red-100/50'
                : 'bg-slate-50/70 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <span
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                    isStep1Valid ? 'bg-[#E53935] text-white' : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  2
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                    <span>Manual Payment Gateway</span>
                    {isStep1Valid ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-200 text-slate-600 font-medium px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Complete Step 1 to Unlock</span>
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <span className="text-xs text-slate-400">Step 2 of 2</span>
            </div>

            {/* Upfront Delivery Charge Notice */}
            <div className="bg-red-50/80 rounded-2xl p-4 border border-red-100 mb-6 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#E53935] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                ৳
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <p className="font-extrabold text-slate-900 text-sm">
                  Upfront Delivery Fee: {formatTaka(cartFinancials.upfrontDue)} Only
                </p>
                <p className="mt-0.5 text-slate-600">
                  To prevent fraudulent orders, users pay only the <strong>150 TK delivery charge</strong> upfront to book the courier slot. You pay the remaining product cost ({formatTaka(cartFinancials.remainingCodDue)}) strictly as <strong>Cash on Delivery (COD)</strong> at your doorstep!
                </p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                disabled={!isStep1Valid}
                onClick={() => setPaymentMethod('bKash')}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  paymentMethod === 'bKash'
                    ? 'border-[#E2136E] bg-pink-50/60 ring-2 ring-pink-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#E2136E] text-white font-extrabold text-xs flex items-center justify-center">
                    bK
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-900">bKash Personal</p>
                    <p className="text-[10px] text-slate-500">Send Money / Payment</p>
                  </div>
                </div>
                {paymentMethod === 'bKash' && <Check className="w-4 h-4 text-[#E2136E]" />}
              </button>

              <button
                type="button"
                disabled={!isStep1Valid}
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  paymentMethod === 'Nagad'
                    ? 'border-[#F7941D] bg-orange-50/60 ring-2 ring-orange-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F7941D] text-white font-extrabold text-xs flex items-center justify-center">
                    NG
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-900">Nagad Personal</p>
                    <p className="text-[10px] text-slate-500">Send Money</p>
                  </div>
                </div>
                {paymentMethod === 'Nagad' && <Check className="w-4 h-4 text-[#F7941D]" />}
              </button>
            </div>

            {/* Merchant Number Display & One-Click Copy */}
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-amber-200/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Official SaiMx Merchant Number
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 tracking-wider">
                  {MERCHANT_BKASH_NAGAD_NUMBER}
                </span>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  ✓ Verified Merchant (Type: Send Money or Payment)
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyMerchant}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs ${
                  copiedMerchant
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E53935] hover:bg-red-700 text-white'
                }`}
              >
                {copiedMerchant ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMerchant ? 'Copied Number!' : 'Copy Number'}</span>
              </button>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5 mb-6">
              <h5 className="font-bold text-slate-900">How to complete payment:</h5>
              <p>1. Open your <strong>{paymentMethod} App</strong> or dial *247# / *167#.</p>
              <p>2. Select <strong>Send Money</strong> (or Payment).</p>
              <p>3. Enter receiver number: <strong>{MERCHANT_BKASH_NAGAD_NUMBER}</strong></p>
              <p>4. Enter amount: <strong>{formatTaka(cartFinancials.upfrontDue)}</strong></p>
              <p>5. Enter reference: <strong>SaiMx</strong> and complete with your PIN.</p>
              <p>6. Copy the <strong>Transaction ID (TrxID)</strong> and paste below.</p>
            </div>

            {/* Input 1: Sender Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Sender Mobile Number ({paymentMethod}) *
                </label>
                <input
                  type="tel"
                  disabled={!isStep1Valid}
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="e.g. 01711223344"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] disabled:opacity-50"
                />
                {!isSenderPhoneValid && senderPhone.length > 0 && (
                  <p className="text-[10px] text-red-500">Valid 11-digit number required</p>
                )}
              </div>

              {/* Input 2: Transaction ID (TrxID) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Transaction ID (TrxID) *
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickTrxFill}
                    className="text-[10px] text-[#E53935] font-bold hover:underline flex items-center space-x-0.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-fill Demo TrxID</span>
                  </button>
                </div>
                <input
                  type="text"
                  disabled={!isStep1Valid}
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder={paymentMethod === 'bKash' ? 'e.g. BK9X892110' : 'e.g. NGD8201452'}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] disabled:opacity-50"
                />
                {!isTrxIdValid && transactionId.length > 0 && (
                  <p className="text-[10px] text-red-500">Must be 8 to 14 alphanumeric characters</p>
                )}
              </div>
            </div>

            {/* Confirm & Place Order CTA */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!canSubmitOrder}
                className="w-full py-4 bg-[#E53935] hover:bg-red-700 text-white rounded-2xl text-sm font-black tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Confirm Payment & Place Order</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {!canSubmitOrder && (
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  Complete required shipping fields and enter valid TrxID to place order
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs sticky top-24 space-y-5">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatTaka(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                <span className="font-bold text-slate-800">{formatTaka(cartFinancials.subtotal)}</span>
              </div>

              {cartFinancials.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-{formatTaka(cartFinancials.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Flat Delivery Fee:</span>
                <span className="font-bold text-slate-800">
                  {cartFinancials.deliveryCharge === 0 ? 'FREE' : formatTaka(cartFinancials.deliveryCharge)}
                </span>
              </div>

              {/* Highlighted Upfront payment */}
              <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-xs flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-[#E53935] block">Pay Now (bKash/Nagad):</span>
                  <span className="text-[10px] text-slate-500">Upfront booking deposit</span>
                </div>
                <span className="text-lg font-black text-[#E53935]">
                  {formatTaka(cartFinancials.upfrontDue)}
                </span>
              </div>

              {/* Cash on Delivery amount */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">Due at Delivery (COD):</span>
                  <span className="text-[10px] text-slate-500">Pay cash upon home inspection</span>
                </div>
                <span className="text-base font-bold text-slate-800">
                  {formatTaka(cartFinancials.remainingCodDue)}
                </span>
              </div>
            </div>

            {/* Trust and safety */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Encrypted & Protected Manual Audit</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500" />
                <span>Pathao & Steadfast Doorstep Courier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
