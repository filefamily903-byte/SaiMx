/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shirt, ShoppingBag, Smartphone, Baby, Home, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoryCards: React.FC = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId, setCurrentView } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Baby':
        return <Baby className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleSelect = (catId: string) => {
    if (selectedCategoryId === catId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(catId);
    }
    setCurrentView('home');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Explore Collections</span>
            <span className="text-xs bg-red-100 text-[#E53935] font-bold px-2.5 py-0.5 rounded-full">
              Pr1 - Pr5
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select a category to filter authentic products
          </p>
        </div>

        {selectedCategoryId && (
          <button
            onClick={() => setSelectedCategoryId(null)}
            className="text-xs font-semibold text-[#E53935] hover:underline flex items-center space-x-1"
          >
            <span>Show All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`group relative text-left rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between overflow-hidden shadow-2xs ${
                isSelected
                  ? 'bg-red-50/80 border-[#E53935] ring-2 ring-[#E53935]/20 shadow-md'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-red-200 hover:shadow-md'
              }`}
            >
              {/* Top Accent Icon & Badge */}
              <div className="flex items-start justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#E53935] text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-red-100 group-hover:text-[#E53935]'
                  }`}
                >
                  {getIcon(cat.iconName)}
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#E53935] text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-[#E53935]'
                  }`}
                >
                  {cat.id.toUpperCase()}
                </span>
              </div>

              {/* Category Info */}
              <div>
                <h3
                  className={`text-sm font-bold tracking-tight transition-colors ${
                    isSelected ? 'text-[#E53935]' : 'text-slate-900 group-hover:text-[#E53935]'
                  }`}
                >
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cat.tagline}</p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{cat.itemCount} Items</span>
                  <span
                    className={`font-semibold ${
                      isSelected ? 'text-[#E53935]' : 'group-hover:text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Active Filter' : 'Browse →'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
