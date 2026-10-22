/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ZoomIn,
  Ruler,
  Heart,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';
import { INITIAL_REVIEWS } from '../data/mockData';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    addToCart,
    buyNow,
    wishlist,
    toggleWishlist,
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');

  if (!product) return null;

  // Initialize size and color if not set
  const currentSize = selectedSize || (product.sizes ? product.sizes[0] : '');
  const currentColor = selectedColor || (product.colors ? product.colors[0] : '');

  // AI Recommendation items: other items in same category or flash sales
  const recommendedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const isWishlisted = wishlist.includes(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const productReviews = INITIAL_REVIEWS.filter((r) => r.productId === product.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Left: Multi-Angle Image Gallery with Zoom */}
            <div className="md:col-span-6 space-y-3">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in group"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isZoomed ? 'scale-150' : 'group-hover:scale-105'
                  }`}
                />

                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1 backdrop-blur-xs">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{isZoomed ? 'Click to minimize' : 'Click to zoom'}</span>
                </div>

                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#E53935] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Multi-angle Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#E53935] ring-2 ring-red-100'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery & Purity Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <Truck className="w-4 h-4 text-[#E53935] mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-800">150 TK Delivery</p>
                  <p className="text-[9px] text-slate-500">Dhaka & Outside</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-800">100% Genuine</p>
                  <p className="text-[9px] text-slate-500">Quality Checked</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-800">7 Days Return</p>
                  <p className="text-[9px] text-slate-500">Hassle-Free</p>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Category & Wishlist */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#E53935] uppercase tracking-wider">
                    {product.categoryId.toUpperCase()} COLLECTION
                  </span>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-[#E53935] transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#E53935] text-[#E53935]' : ''}`} />
                  </button>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Stock status */}
                <div className="mt-2 flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-slate-800">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  {/* Stock Availability status */}
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">
                      Low Stock: Only {product.stock} units left!
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>In Stock ({product.stock} available)</span>
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-red-50/50 rounded-2xl border border-red-100 flex items-baseline space-x-3">
                  <span className="text-2xl sm:text-3xl font-black text-[#E53935]">
                    {formatTaka(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatTaka(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-xs font-bold bg-[#E53935] text-white px-2 py-0.5 rounded-md">
                      SAVE {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Upfront Delivery Note */}
                <p className="text-[11px] text-slate-500 mt-2 bg-amber-50 text-amber-800 p-2 rounded-xl border border-amber-200/60">
                  ℹ️ <strong>Upfront Payment Rule:</strong> You pay only the <strong>150 TK delivery charge</strong> via bKash/Nagad now. The remaining {formatTaka(product.price)} is paid Cash on Delivery!
                </p>

                {/* Sizes Selector & Size Chart */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-700">Select Size:</span>
                      <button
                        onClick={() => setIsSizeChartOpen(true)}
                        className="text-xs text-[#E53935] font-semibold flex items-center space-x-1 hover:underline"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Size Chart</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                            currentSize === sz
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">Select Color:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((clr) => (
                        <button
                          key={clr}
                          onClick={() => setSelectedColor(clr)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                            currentColor === clr
                              ? 'bg-[#E53935] text-white border-[#E53935] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {clr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-4 flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-l-xl font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-r-xl font-bold"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">Total: {formatTaka(product.price * quantity)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity, currentSize, currentColor)}
                  disabled={isOutOfStock}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border-2 border-[#E53935] text-[#E53935] hover:bg-red-50 text-sm font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    buyNow(product, quantity, currentSize, currentColor);
                    setSelectedProductId(null);
                  }}
                  disabled={isOutOfStock}
                  className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-[#E53935] hover:bg-red-700 text-white text-sm font-bold transition-all shadow-md transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description & Reviews Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex space-x-6 border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'details'
                    ? 'border-b-2 border-[#E53935] text-[#E53935]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Product Details & Features
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-[#E53935] text-[#E53935]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Customer Reviews ({productReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-b-2 border-[#E53935] text-[#E53935]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Shipping & Returns Policy
              </button>
            </div>

            <div className="py-4 text-xs text-slate-600 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Key Highlights:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  {productReviews.length > 0 ? (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{rev.userName} ({rev.userDistrict})</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-500 mb-1">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-slate-600 text-xs">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No reviews yet for this product. Be the first to review!</p>
                  )}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• <strong>Dhaka City:</strong> 24 to 48 Hours Express Delivery via Pathao / Steadfast.</p>
                  <p>• <strong>Outside Dhaka:</strong> 2 to 4 Days to all 64 Districts.</p>
                  <p>• <strong>Delivery Fee:</strong> 150 TK flat across Bangladesh (Free on orders over 5,000 TK).</p>
                  <p>• <strong>Payment terms:</strong> Pay 150 TK delivery charge upfront via bKash/Nagad to confirm order. Remaining amount payable Cash on Delivery (COD).</p>
                  <p>• <strong>Return policy:</strong> 7-day hassle-free replacement for any damaged or defective goods.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Recommendation Module: "People also bought this" */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E53935]" />
                <span>AI Recommendation: People Also Bought This</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendedProducts.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setSelectedProductId(rec.id);
                    setActiveImageIndex(0);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-xl border border-slate-200 hover:border-red-300 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-2xs group"
                >
                  <img src={rec.images[0]} alt={rec.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#E53935]">
                      {rec.name}
                    </p>
                    <p className="text-xs font-bold text-[#E53935]">{formatTaka(rec.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Size Chart Modal Overlay */}
        {isSizeChartOpen && (
          <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-[#E53935]" />
                  <span>Standard Size Chart (Inches)</span>
                </h4>
                <button
                  onClick={() => setIsSizeChartOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto text-xs">
                <table className="w-full border-collapse border border-slate-200 text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700">
                      <th className="border border-slate-200 p-2 font-bold">Size</th>
                      <th className="border border-slate-200 p-2 font-bold">Chest</th>
                      <th className="border border-slate-200 p-2 font-bold">Length</th>
                      <th className="border border-slate-200 p-2 font-bold">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-2 font-bold">M (40)</td>
                      <td className="border border-slate-200 p-2">40"</td>
                      <td className="border border-slate-200 p-2">40"</td>
                      <td className="border border-slate-200 p-2">24.5"</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-2 font-bold">L (42)</td>
                      <td className="border border-slate-200 p-2">42"</td>
                      <td className="border border-slate-200 p-2">42"</td>
                      <td className="border border-slate-200 p-2">25"</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-2 font-bold">XL (44)</td>
                      <td className="border border-slate-200 p-2">44"</td>
                      <td className="border border-slate-200 p-2">44"</td>
                      <td className="border border-slate-200 p-2">25.5"</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-2 font-bold">XXL (46)</td>
                      <td className="border border-slate-200 p-2">46"</td>
                      <td className="border border-slate-200 p-2">45"</td>
                      <td className="border border-slate-200 p-2">26"</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-slate-400 mt-3">
                Measurements may have a standard tolerance of ±0.5 inches.
              </p>

              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="mt-4 w-full py-2 bg-[#E53935] text-white text-xs font-bold rounded-xl"
              >
                Close Size Chart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
