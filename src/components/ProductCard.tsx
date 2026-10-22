/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ShoppingCart, Zap, Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, buyNow, setSelectedProductId, wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-red-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Image Container with Badges & Wishlist */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer" onClick={() => setSelectedProductId(product.id)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs ${
                product.badge === 'Flash Sale'
                  ? 'bg-[#E53935] text-white'
                  : product.badge === 'Best Seller'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-900 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-bold bg-rose-100 text-[#E53935] px-1.5 py-0.5 rounded-md border border-rose-200/60 shadow-2xs">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-colors shadow-2xs ${
            isWishlisted
              ? 'bg-[#E53935] text-white'
              : 'bg-white/80 hover:bg-white text-slate-500 hover:text-[#E53935]'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Low Stock Banner */}
        {isLowStock && (
          <div className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[10px] font-bold py-0.5 text-center">
            ⚠️ Only {product.stock} units left!
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category code & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase text-slate-400">
              {product.categoryId.toUpperCase()}
            </span>
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProductId(product.id)}
            className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-[#E53935] line-clamp-2 cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-base sm:text-lg font-extrabold text-[#E53935]">
              {formatTaka(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatTaka(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl border border-slate-200 hover:border-red-300 bg-white hover:bg-red-50 text-slate-700 hover:text-[#E53935] text-xs font-semibold transition-all shadow-2xs"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={() => buyNow(product, 1)}
            className="flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
