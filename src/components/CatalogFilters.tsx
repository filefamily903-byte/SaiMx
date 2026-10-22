/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Star,
  Tag,
  Sparkles,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { extractAvailableFacets } from '../utils/filter';
import { formatTaka } from '../utils/pricing';

interface CatalogFiltersProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const {
    products,
    categories,
    filterCriteria,
    updateFilter,
    resetFilters,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useApp();

  // Dynamic available facets from catalog
  const facets = useMemo(() => extractAvailableFacets(products), [products]);

  // Handle Brand checkbox toggle
  const handleToggleBrand = (brand: string) => {
    const current = filterCriteria.brands || [];
    if (current.includes(brand)) {
      updateFilter(
        'brands',
        current.filter((b) => b !== brand)
      );
    } else {
      updateFilter('brands', [...current, brand]);
    }
  };

  // Handle Size toggle
  const handleToggleSize = (size: string) => {
    const current = filterCriteria.sizes || [];
    if (current.includes(size)) {
      updateFilter(
        'sizes',
        current.filter((s) => s !== size)
      );
    } else {
      updateFilter('sizes', [...current, size]);
    }
  };

  // Handle Color toggle
  const handleToggleColor = (color: string) => {
    const current = filterCriteria.colors || [];
    if (current.includes(color)) {
      updateFilter(
        'colors',
        current.filter((c) => c !== color)
      );
    } else {
      updateFilter('colors', [...current, color]);
    }
  };

  // Quick budget presets
  const applyPricePreset = (min?: number, max?: number) => {
    updateFilter('minPrice', min);
    updateFilter('maxPrice', max);
  };

  const hasActiveFilters = Boolean(
    filterCriteria.categoryId ||
      filterCriteria.minPrice ||
      filterCriteria.maxPrice ||
      (filterCriteria.brands && filterCriteria.brands.length > 0) ||
      (filterCriteria.sizes && filterCriteria.sizes.length > 0) ||
      (filterCriteria.colors && filterCriteria.colors.length > 0) ||
      filterCriteria.minRating ||
      filterCriteria.inStockOnly ||
      filterCriteria.onSaleOnly
  );

  const content = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#E53935]" />
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Catalog Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-bold text-[#E53935] hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category Facet */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span>Categories</span>
          <span className="text-[10px] text-slate-400 font-normal">Pr1 - Pr5</span>
        </label>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between ${
              !selectedCategoryId
                ? 'bg-[#E53935] text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>All Collections</span>
            <span className="text-[10px] opacity-80">{products.length}</span>
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategoryId(c.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between ${
                selectedCategoryId === c.id
                  ? 'bg-[#E53935] text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{c.displayName}</span>
              <span className="text-[10px] opacity-80">
                {products.filter((p) => p.categoryId === c.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Range Filter with Quick Chips */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900">Price Range (TK)</label>
          {(filterCriteria.minPrice || filterCriteria.maxPrice) && (
            <span className="text-[10px] font-mono font-semibold text-[#E53935]">
              {filterCriteria.minPrice ? formatTaka(filterCriteria.minPrice) : '৳0'} -{' '}
              {filterCriteria.maxPrice ? formatTaka(filterCriteria.maxPrice) : 'Max'}
            </span>
          )}
        </div>

        {/* Quick Budget Chips */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <button
            onClick={() => applyPricePreset(undefined, 1000)}
            className={`px-2 py-1.5 rounded-xl border transition-all text-center ${
              filterCriteria.maxPrice === 1000
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            Under ৳ 1,000
          </button>
          <button
            onClick={() => applyPricePreset(1000, 2500)}
            className={`px-2 py-1.5 rounded-xl border transition-all text-center ${
              filterCriteria.minPrice === 1000 && filterCriteria.maxPrice === 2500
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            ৳ 1,000 - ৳ 2,500
          </button>
          <button
            onClick={() => applyPricePreset(2500, 5000)}
            className={`px-2 py-1.5 rounded-xl border transition-all text-center ${
              filterCriteria.minPrice === 2500 && filterCriteria.maxPrice === 5000
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            ৳ 2,500 - ৳ 5,000
          </button>
          <button
            onClick={() => applyPricePreset(5000, undefined)}
            className={`px-2 py-1.5 rounded-xl border transition-all text-center ${
              filterCriteria.minPrice === 5000 && !filterCriteria.maxPrice
                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            Over ৳ 5,000
          </button>
        </div>

        {/* Custom Min / Max inputs */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            placeholder="Min ৳"
            value={filterCriteria.minPrice ?? ''}
            onChange={(e) =>
              updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max ৳"
            value={filterCriteria.maxPrice ?? ''}
            onChange={(e) =>
              updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* 3. Brand / Artisan Filter */}
      {facets.brands.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-900 block">Brand & Artisan</label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
            {facets.brands.map((brand) => {
              const isChecked = (filterCriteria.brands || []).includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center space-x-2 text-slate-700 cursor-pointer select-none hover:text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleBrand(brand)}
                    className="w-3.5 h-3.5 rounded text-[#E53935] focus:ring-[#E53935]"
                  />
                  <span className="flex-1 text-xs">{brand}</span>
                  <span className="text-[10px] text-slate-400">
                    {products.filter((p) => p.brand === brand).length}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Size Filter (Apparel & Portions) */}
      {facets.sizes.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-900 block">Available Sizes & Portions</label>
          <div className="flex flex-wrap gap-1.5">
            {facets.sizes.map((size) => {
              const isSelected = (filterCriteria.sizes || []).includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleToggleSize(size)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#E53935] text-white border-[#E53935] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Color Palette Filter */}
      {facets.colors.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-900 block">Colors & Shades</label>
          <div className="flex flex-wrap gap-1.5">
            {facets.colors.map((color) => {
              const isSelected = (filterCriteria.colors || []).includes(color);
              return (
                <button
                  key={color}
                  onClick={() => handleToggleColor(color)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border flex items-center space-x-1 transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-slate-300"
                    style={{
                      backgroundColor:
                        color.toLowerCase().includes('red')
                          ? '#E53935'
                          : color.toLowerCase().includes('gold')
                          ? '#F59E0B'
                          : color.toLowerCase().includes('green')
                          ? '#10B981'
                          : color.toLowerCase().includes('black')
                          ? '#1E293B'
                          : color.toLowerCase().includes('white')
                          ? '#FFFFFF'
                          : color.toLowerCase().includes('navy')
                          ? '#1E3A8A'
                          : color.toLowerCase().includes('amber')
                          ? '#D97706'
                          : '#94A3B8',
                    }}
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Rating & Stock Toggles */}
      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
        <label className="font-bold text-slate-900 block">Availability & Rating</label>

        <label className="flex items-center space-x-2 text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filterCriteria.inStockOnly)}
            onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
            className="w-3.5 h-3.5 rounded text-[#E53935]"
          />
          <span>In Stock Items Only</span>
        </label>

        <label className="flex items-center space-x-2 text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filterCriteria.onSaleOnly)}
            onChange={(e) => updateFilter('onSaleOnly', e.target.checked)}
            className="w-3.5 h-3.5 rounded text-[#E53935]"
          />
          <span>On Sale & Flash Deals Only</span>
        </label>

        <label className="flex items-center space-x-2 text-slate-700 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={filterCriteria.minRating === 4.5}
            onChange={(e) => updateFilter('minRating', e.target.checked ? 4.5 : undefined)}
            className="w-3.5 h-3.5 rounded text-[#E53935]"
          />
          <span className="flex items-center space-x-1">
            <span>4.5★ & Above Rating</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
          </span>
        </label>
      </div>
    </div>
  );

  // Mobile Slide-over Drawer
  if (isOpenOnMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-slate-900 text-sm">Refine & Filter</h3>
              <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>

          <button
            onClick={onCloseMobile}
            className="mt-6 w-full py-3 bg-[#E53935] text-white rounded-xl text-xs font-bold shadow-md"
          >
            Show Filtered Products
          </button>
        </div>
      </div>
    );
  }

  // Desktop Static Sidebar
  return (
    <aside className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs sticky top-24">
      {content}
    </aside>
  );
};
