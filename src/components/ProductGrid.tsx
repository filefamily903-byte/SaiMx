/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Flame,
  Clock,
  X,
  RotateCcw,
  Check,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { CatalogFilters } from './CatalogFilters';
import { filterAndSortProducts, SortOption } from '../utils/filter';
import { formatTaka } from '../utils/pricing';

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
    filterCriteria,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
  } = useApp();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort catalog using pure function
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filterCriteria, sortBy);
  }, [products, filterCriteria, sortBy]);

  // Flash sale products (only when not specifically searching or filtering)
  const isFiltering = Boolean(
    filterCriteria.categoryId ||
      filterCriteria.minPrice ||
      filterCriteria.maxPrice ||
      (filterCriteria.brands && filterCriteria.brands.length > 0) ||
      (filterCriteria.sizes && filterCriteria.sizes.length > 0) ||
      (filterCriteria.colors && filterCriteria.colors.length > 0) ||
      filterCriteria.minRating ||
      filterCriteria.inStockOnly ||
      filterCriteria.onSaleOnly ||
      filterCriteria.searchTerm
  );

  const flashSaleItems = useMemo(() => {
    return products.filter((p) => p.isFlashSale || p.badge === 'Flash Sale');
  }, [products]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. Flash Sale Showcase (Only when not deeply filtering) */}
      {!isFiltering && (
        <section className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#E53935] flex items-center justify-center font-black shadow-md">
                <Flame className="w-6 h-6 fill-current animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2">
                  <span>FLASH SALE DEALS</span>
                  <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full uppercase">
                    Up to 32% OFF
                  </span>
                </h2>
                <p className="text-xs text-rose-100">
                  Pay only 150 TK delivery upfront • Remaining balance Cash on Delivery
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold bg-black/20 backdrop-blur-xs px-3.5 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Flash Batch Ends in: 07h 24m 48s</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleItems.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Main Two-Column Catalog Area: Sidebar Filters + Products Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-3">
          <CatalogFilters />
        </div>

        {/* Right Product Grid Column */}
        <div className="lg:col-span-9 space-y-4">
          {/* Header Bar with Sorting & Mobile Filter Trigger */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between sm:justify-start space-x-3">
              {/* Mobile Filter Drawer Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {isFiltering ? '(Active)' : ''}</span>
              </button>

              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>{activeCategory ? activeCategory.displayName : 'All Products'}</span>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {filteredProducts.length} items
                  </span>
                </h2>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-[#FDFBF7] border border-slate-200 text-xs font-semibold text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              >
                <option value="featured">Featured & Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="discount">Biggest Discount (% Off)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges Bar */}
          {isFiltering && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-red-50/50 rounded-2xl border border-red-100 text-xs">
              <span className="text-[11px] font-bold text-slate-500">Active Filters:</span>

              {selectedCategoryId && (
                <span className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  <span>{activeCategory?.name || selectedCategoryId.toUpperCase()}</span>
                  <button onClick={() => setSelectedCategoryId(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(filterCriteria.minPrice !== undefined || filterCriteria.maxPrice !== undefined) && (
                <span className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  <span>
                    {filterCriteria.minPrice ? formatTaka(filterCriteria.minPrice) : '৳0'} -{' '}
                    {filterCriteria.maxPrice ? formatTaka(filterCriteria.maxPrice) : 'Max'}
                  </span>
                  <button
                    onClick={() => {
                      updateFilter('minPrice', undefined);
                      updateFilter('maxPrice', undefined);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterCriteria.brands?.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs"
                >
                  <span>{b}</span>
                  <button
                    onClick={() =>
                      updateFilter(
                        'brands',
                        filterCriteria.brands?.filter((x) => x !== b)
                      )
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filterCriteria.sizes?.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs"
                >
                  <span>Size: {s}</span>
                  <button
                    onClick={() =>
                      updateFilter(
                        'sizes',
                        filterCriteria.sizes?.filter((x) => x !== s)
                      )
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filterCriteria.colors?.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs"
                >
                  <span>Color: {c}</span>
                  <button
                    onClick={() =>
                      updateFilter(
                        'colors',
                        filterCriteria.colors?.filter((x) => x !== c)
                      )
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filterCriteria.inStockOnly && (
                <span className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  <span>In Stock Only</span>
                  <button onClick={() => updateFilter('inStockOnly', false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterCriteria.onSaleOnly && (
                <span className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  <span>Flash / Sale Deals</span>
                  <button onClick={() => updateFilter('onSaleOnly', false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterCriteria.minRating && (
                <span className="inline-flex items-center space-x-1 bg-white border border-red-200 text-[#E53935] px-2.5 py-1 rounded-full font-semibold shadow-2xs">
                  <span>{filterCriteria.minRating}★ & Above</span>
                  <button onClick={() => updateFilter('minRating', undefined)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-[#E53935] hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* 3. Products Grid List */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
              <div className="w-14 h-14 bg-red-50 text-[#E53935] rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try widening your price range, deselecting size/color tags, or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#E53935] text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors shadow-2xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Filters Slide-Over Drawer */}
      <CatalogFilters
        isOpenOnMobile={isMobileFilterOpen}
        onCloseMobile={() => setIsMobileFilterOpen(false)}
      />
    </div>
  );
};
