/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortProducts, extractAvailableFacets } from './filter';
import { Product } from '../types';

const sampleProducts: Product[] = [
  {
    id: 'p1',
    name: 'Cotton Panjabi',
    categoryId: 'pr1',
    brand: 'SaiMx Heritage',
    price: 2450,
    originalPrice: 3500,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 84,
    stock: 14,
    soldCount: 150,
    description: 'Cotton festive panjabi',
    features: [],
    images: ['img1.jpg'],
    sizes: ['M (40)', 'L (42)'],
    colors: ['Off-White Cream'],
    isFlashSale: true,
    createdAt: '2026-10-01',
  },
  {
    id: 'p2',
    name: 'Silk Saree',
    categoryId: 'pr1',
    brand: 'Bengal Handloom',
    price: 5200,
    originalPrice: 7500,
    discountPercent: 31,
    rating: 4.8,
    reviewCount: 42,
    stock: 0, // Out of stock
    soldCount: 70,
    description: 'Mulberry silk',
    features: [],
    images: ['img2.jpg'],
    sizes: ['Standard'],
    colors: ['Crimson Red'],
    isFlashSale: false,
    createdAt: '2026-09-15',
  },
  {
    id: 'p3',
    name: 'Raw Honey 1kg',
    categoryId: 'pr2',
    brand: 'Sundarban Organic',
    price: 1150,
    originalPrice: 1400,
    discountPercent: 18,
    rating: 4.95,
    reviewCount: 160,
    stock: 28,
    soldCount: 300,
    description: 'Wild forest honey',
    features: [],
    images: ['img3.jpg'],
    sizes: ['1000g (1kg)'],
    colors: ['Natural Amber'],
    isFlashSale: true,
    createdAt: '2026-10-10',
  },
];

test('Filters by Category correctly', () => {
  const result = filterAndSortProducts(sampleProducts, { categoryId: 'pr1' });
  assert.equal(result.length, 2);
  assert.equal(result.some((p) => p.id === 'p3'), false);
});

test('Filters by Price Range correctly', () => {
  const result = filterAndSortProducts(sampleProducts, { minPrice: 1000, maxPrice: 3000 });
  assert.equal(result.length, 2); // p1 (2450) and p3 (1150)
  assert.equal(result.some((p) => p.id === 'p2'), false); // p2 is 5200
});

test('Filters by Brand correctly', () => {
  const result = filterAndSortProducts(sampleProducts, { brands: ['Sundarban Organic'] });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'p3');
});

test('Filters by In Stock Only excludes out of stock items', () => {
  const result = filterAndSortProducts(sampleProducts, { inStockOnly: true });
  assert.equal(result.length, 2);
  assert.equal(result.some((p) => p.id === 'p2'), false); // p2 stock is 0
});

test('Filters by Color correctly', () => {
  const result = filterAndSortProducts(sampleProducts, { colors: ['Natural Amber'] });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'p3');
});

test('Sorts by Price: Low to High', () => {
  const result = filterAndSortProducts(sampleProducts, {}, 'price-low');
  assert.equal(result[0].id, 'p3'); // 1150
  assert.equal(result[1].id, 'p1'); // 2450
  assert.equal(result[2].id, 'p2'); // 5200
});

test('Sorts by Most Popular (highest soldCount)', () => {
  const result = filterAndSortProducts(sampleProducts, {}, 'popular');
  assert.equal(result[0].id, 'p3'); // 300 sold
  assert.equal(result[1].id, 'p1'); // 150 sold
  assert.equal(result[2].id, 'p2'); // 70 sold
});

test('Sorts by Newest Arrivals', () => {
  const result = filterAndSortProducts(sampleProducts, {}, 'newest');
  assert.equal(result[0].id, 'p3'); // 2026-10-10
  assert.equal(result[1].id, 'p1'); // 2026-10-01
  assert.equal(result[2].id, 'p2'); // 2026-09-15
});

test('extractAvailableFacets collects unique attributes correctly', () => {
  const facets = extractAvailableFacets(sampleProducts);
  assert.equal(facets.brands.length, 3);
  assert.equal(facets.minPrice, 1150);
  assert.equal(facets.maxPrice, 5200);
});
