/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export interface FilterCriteria {
  categoryId?: string | null;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  searchTerm?: string;
}

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'newest'
  | 'popular'
  | 'rating'
  | 'discount';

/**
 * Pure function to filter and sort products by multiple criteria
 */
export function filterAndSortProducts(
  products: Product[],
  filters: FilterCriteria,
  sortBy: SortOption = 'featured'
): Product[] {
  let result = products.filter((product) => {
    // Category filter
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }

    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      if (!product.brand || !filters.brands.includes(product.brand)) {
        return false;
      }
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      if (!product.sizes || !product.sizes.some((s) => filters.sizes!.includes(s))) {
        return false;
      }
    }

    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      if (!product.colors || !product.colors.some((c) => filters.colors!.includes(c))) {
        return false;
      }
    }

    // Minimum Rating filter
    if (filters.minRating !== undefined && product.rating < filters.minRating) {
      return false;
    }

    // In Stock Only
    if (filters.inStockOnly && product.stock <= 0) {
      return false;
    }

    // On Sale Only
    if (filters.onSaleOnly && !product.isFlashSale && product.discountPercent <= 0) {
      return false;
    }

    // Search query
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const q = filters.searchTerm.trim().toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchBrand = product.brand ? product.brand.toLowerCase().includes(q) : false;
      const matchCat = product.categoryId.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchBrand && !matchCat) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  return result.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        // If createdAt is present, sort descending
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      case 'popular':
        return (b.soldCount || 0) - (a.soldCount || 0);
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discountPercent - a.discountPercent;
      case 'featured':
      default:
        // Flash sale and high rating first
        const priorityA = (a.isFlashSale ? 100 : 0) + (a.badge === 'Best Seller' ? 50 : 0);
        const priorityB = (b.isFlashSale ? 100 : 0) + (b.badge === 'Best Seller' ? 50 : 0);
        return priorityB - priorityA;
    }
  });
}

/**
 * Extracts unique available filter facets from current product list
 */
export function extractAvailableFacets(products: Product[]) {
  const brands = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((p) => {
    if (p.brand) brands.add(p.brand);
    p.sizes?.forEach((s) => sizes.add(s));
    p.colors?.forEach((c) => colors.add(c));
    if (p.price < minPrice) minPrice = p.price;
    if (p.price > maxPrice) maxPrice = p.price;
  });

  return {
    brands: Array.from(brands).sort(),
    sizes: Array.from(sizes).sort(),
    colors: Array.from(colors).sort(),
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice: maxPrice === 0 ? 10000 : maxPrice,
  };
}
