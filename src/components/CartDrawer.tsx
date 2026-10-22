/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartFinancials,
    couponCode,
    applyCoupon,
    setCurrentView,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#E53935]" />
            <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
            <span className="text-xs bg-red-100 text-[#E53935] font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="py-3.5 flex space-x-3.5">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      className="text-slate-400 hover:text-red-600 transition-colors ml-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    {item.selectedColor && (
                      <>
                        <span>•</span>
                        <span>{item.selectedColor}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)
                        }
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 rounded-l-lg font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)
                        }
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 rounded-r-lg font-bold"
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-extrabold text-[#E53935]">
                      {formatTaka(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#E53935] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Your shopping bag is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our authentic collections across fashion, honey, mustard oil, gadgets and kids!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-3 px-5 py-2 bg-[#E53935] text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors shadow-2xs"
              >
                Start Shopping Now
              </button>
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-[#FDFBF7] space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Coupon (e.g. SAIMX10, WELCOME50)"
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs uppercase placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E53935]"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Apply
              </button>
            </form>

            {couponCode && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Coupon <strong>{couponCode}</strong> applied</span>
                </span>
                <span className="font-bold">-{formatTaka(cartFinancials.discount)}</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Products Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatTaka(cartFinancials.subtotal)}</span>
              </div>

              {cartFinancials.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatTaka(cartFinancials.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge (All Bangladesh):</span>
                <span className="font-semibold text-slate-800">
                  {cartFinancials.deliveryCharge === 0 ? 'FREE' : formatTaka(cartFinancials.deliveryCharge)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Upfront Due Today:</span>
                  <span className="text-[10px] text-slate-500">(150 TK delivery fee via bKash/Nagad)</span>
                </div>
                <span className="text-base font-black text-[#E53935]">
                  {formatTaka(cartFinancials.upfrontDue)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                <span>Remaining Cash on Delivery:</span>
                <span className="font-bold text-slate-800">{formatTaka(cartFinancials.remainingCodDue)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
