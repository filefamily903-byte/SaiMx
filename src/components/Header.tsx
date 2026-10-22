/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Clock,
  X,
  Menu,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    cartFinancials,
    setIsCartOpen,
    wishlist,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedProductId,
    products,
    searchTerm,
    setSearchTerm,
    isAdminLoggedIn,
  } = useApp();

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 48 });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products for predictive search
  const filteredSuggestions = searchTerm.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSelectProductSuggestion = (prodId: string) => {
    setSelectedProductId(prodId);
    setSearchTerm('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7] shadow-xs border-b border-amber-100/60">
      {/* 1. Announcement Ticker */}
      <div className="bg-[#1E293B] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="bg-[#E53935] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
              ⚡ Flash Offer
            </span>
            <p className="truncate text-slate-200">
              Free delivery on orders over <strong>5,000 TK</strong> | Pay only 150 TK delivery upfront, rest Cash on Delivery!
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-300 shrink-0">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Ends in:</span>
              <span className="font-mono font-bold text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <span className="text-slate-500">|</span>
            <div className="flex items-center space-x-1">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Helpline: 01735126250</span>
            </div>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center space-x-1 text-xs hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setCurrentView('home');
                setSelectedCategoryId(null);
                setSelectedProductId(null);
              }}
              className="group flex items-center space-x-1.5 focus:outline-none"
            >
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#E53935] transition-colors">
                Sai<span className="text-[#E53935]">Mx</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse"></span>
            </button>

            {/* Our Collection Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <span>Our Collection</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCollectionOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCollectionOpen && (
                <div
                  onMouseLeave={() => setIsCollectionOpen(false)}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Categories (Pr1 - Pr5)
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setCurrentView('home');
                        setIsCollectionOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-red-50 hover:text-[#E53935] transition-colors ${
                        selectedCategoryId === cat.id ? 'bg-red-50 text-[#E53935] font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <span>{cat.displayName}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                        {cat.itemCount}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-2 pt-1 px-3">
                    <button
                      onClick={() => {
                        setSelectedCategoryId(null);
                        setCurrentView('home');
                        setIsCollectionOpen(false);
                      }}
                      className="w-full text-left text-xs text-[#E53935] font-medium py-1.5 hover:underline"
                    >
                      View All Products →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar with Predictive Suggestions */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Panjabi, Silk Saree, TWS, Honey, Rice..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E53935]/30 focus:border-[#E53935] transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Predictive Auto-suggestions Dropdown */}
            {isSearchFocused && filteredSuggestions.length > 0 && (
              <div
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Suggested Products</span>
                  <span>{filteredSuggestions.length} items found</span>
                </div>
                {filteredSuggestions.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelectProductSuggestion(prod.id)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-3 transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                      <p className="text-xs text-[#E53935] font-semibold">{formatTaka(prod.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Wishlist */}
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView('profile');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="relative p-2 text-slate-600 hover:text-[#E53935] transition-colors rounded-full hover:bg-white"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-white hover:bg-red-50 text-slate-800 hover:text-[#E53935] border border-slate-200 hover:border-red-200 rounded-full transition-all shadow-2xs group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-700 group-hover:text-[#E53935] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E53935] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-900 group-hover:text-[#E53935]">
                {formatTaka(cartFinancials.subtotal)}
              </span>
            </button>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:border-[#E53935] transition-colors shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-red-100 text-[#E53935] flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline truncate max-w-[90px]">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile & Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Live Order Tracking</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#E53935] hover:bg-white rounded-full transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E53935] hover:bg-red-700 rounded-full transition-colors shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Collection</p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategoryId(c.id);
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-red-50 hover:text-[#E53935]"
                >
                  {c.displayName}
                </button>
              ))}
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-600 px-2">
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-emerald-700 font-semibold"
              >
                🔐 Admin Portal
              </button>
              <span>Helpline: 01735126250</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
