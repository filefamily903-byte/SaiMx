/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Slide {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  categoryTarget?: string;
  bgGradient: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'Welcome to SaiMx',
    title: 'Your favourite shopping platform.',
    highlight: 'Pure Heritage & Everyday Essentials',
    description: 'Explore verified Bangladeshi and South Asian fashion, authentic Sundarban honey, pure cold-pressed mustard oil, and premium lifestyle goods.',
    ctaText: 'Shop New Arrivals',
    categoryTarget: 'pr1',
    bgGradient: 'from-amber-50 to-orange-50/60',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    tag: 'Hassle-Free Shopping',
    title: 'Pay Only 150 TK Upfront.',
    highlight: 'Remaining Balance Cash on Delivery',
    description: 'Secure your order instantly by paying just the 150 TK delivery fee via bKash or Nagad. Inspect and pay for your products upon home delivery.',
    ctaText: 'Browse Flash Deals',
    bgGradient: 'from-red-50 to-rose-50/60',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    tag: '100% Guaranteed Purity',
    title: 'Natural & Organic Groceries.',
    highlight: 'Straight from Forest to Table',
    description: 'Ethically harvested Sundarban wild honey, cold wood-pressed pure mustard oil, and aromatic Chinigura rice for your healthy household.',
    ctaText: 'Explore Groceries',
    categoryTarget: 'pr2',
    bgGradient: 'from-emerald-50 to-teal-50/60',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
  },
];

export const HeroSlider: React.FC = () => {
  const { setSelectedCategoryId, setCurrentView } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  const handleCta = () => {
    if (slide.categoryTarget) {
      setSelectedCategoryId(slide.categoryTarget);
    }
    setCurrentView('home');
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Slider Banner Card */}
      <div
        className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bgGradient} border border-slate-200/70 shadow-sm transition-all duration-700 min-h-[360px] sm:min-h-[420px] flex items-center`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 w-full p-6 sm:p-10 lg:p-12 items-center gap-6">
          {/* Text Content */}
          <div className="md:col-span-7 space-y-3 sm:space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-bold text-[#E53935] uppercase tracking-wide shadow-2xs">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{slide.tag}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {slide.title}
              <span className="block text-xl sm:text-2xl lg:text-3xl font-semibold text-[#E53935] mt-1">
                {slide.highlight}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
              {slide.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleCta}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#E53935] hover:bg-red-700 text-white rounded-full font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setCurrentView('home');
                }}
                className="px-5 py-3 bg-white/80 hover:bg-white text-slate-800 rounded-full font-semibold text-sm border border-slate-300 transition-colors shadow-2xs"
              >
                View Full Catalog
              </button>
            </div>
          </div>

          {/* Banner Image */}
          <div className="md:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-800 flex items-center justify-between">
                <span>Verified Authentic Products</span>
                <span className="text-[#E53935]">⚡ Fast Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center border border-slate-200 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center border border-slate-200 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-[#E53935]' : 'w-2 bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-white rounded-xl p-3 border border-slate-200/70 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-[#E53935] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">150 TK Flat Delivery</h4>
            <p className="text-[11px] text-slate-500">Dhaka & all 64 districts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/70 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine Items</h4>
            <p className="text-[11px] text-slate-500">Ethically sourced products</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/70 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">7 Days Easy Return</h4>
            <p className="text-[11px] text-slate-500">Instant refund or exchange</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/70 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-[#E53935] flex items-center justify-center shrink-0 font-bold text-xs">
            ৳
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">bKash & Nagad</h4>
            <p className="text-[11px] text-slate-500">Fast 5-min manual verify</p>
          </div>
        </div>
      </div>
    </div>
  );
};
