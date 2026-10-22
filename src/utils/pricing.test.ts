/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderFinancials,
  calculateCouponDiscount,
  isValidBangladeshiPhone,
  isValidTrxId,
  validatePassword,
  formatTaka,
  FLAT_DELIVERY_CHARGE,
} from './pricing';

test('Phone Number Validation checks Bangladeshi formats correctly', () => {
  assert.equal(isValidBangladeshiPhone('01735126250'), true);
  assert.equal(isValidBangladeshiPhone('01912345678'), true);
  assert.equal(isValidBangladeshiPhone('01300000000'), true);
  assert.equal(isValidBangladeshiPhone('018-1234-5678'), true); // handles hyphens
  assert.equal(isValidBangladeshiPhone('01234567890'), false); // 012 is not a valid BD prefix
  assert.equal(isValidBangladeshiPhone('1735126250'), false); // missing leading 0
  assert.equal(isValidBangladeshiPhone('017351262501'), false); // 12 digits
  assert.equal(isValidBangladeshiPhone(''), false);
});

test('TrxID Validation validates bKash/Nagad transaction codes', () => {
  assert.equal(isValidTrxId('9K82JD41'), true);
  assert.equal(isValidTrxId('BL39X890K1'), true);
  assert.equal(isValidTrxId('NGD9823190'), true);
  assert.equal(isValidTrxId('short'), false); // < 8 chars
  assert.equal(isValidTrxId('invalid@trx#'), false); // special characters
  assert.equal(isValidTrxId(''), false);
});

test('Password Validation ensures 8-16 characters with letters and numbers', () => {
  assert.equal(validatePassword('Saimxds@2026').isValid, true);
  assert.equal(validatePassword('Pass1234').isValid, true);
  assert.equal(validatePassword('short1').isValid, false); // < 8
  assert.equal(validatePassword('justlettershere').isValid, false); // no number
  assert.equal(validatePassword('1234567890').isValid, false); // no letters
});

test('Coupon discounts calculate correctly', () => {
  assert.equal(calculateCouponDiscount('SAIMX10', 2000), 200); // 10%
  assert.equal(calculateCouponDiscount('WELCOME50', 500), 50); // 50 TK
  assert.equal(calculateCouponDiscount('UNKNOWN', 1000), 0);
  assert.equal(calculateCouponDiscount(undefined, 1000), 0);
});

test('Order financials enforce 150 TK upfront delivery charge and remaining COD', () => {
  const items = [
    { price: 1200, quantity: 2 }, // 2400
  ];
  const financials = calculateOrderFinancials(items);
  assert.equal(financials.subtotal, 2400);
  assert.equal(financials.discount, 0);
  assert.equal(financials.deliveryCharge, FLAT_DELIVERY_CHARGE);
  assert.equal(financials.upfrontDue, 150); // Upfront delivery charge
  assert.equal(financials.remainingCodDue, 2400); // Remaining payable on delivery
  assert.equal(financials.totalOrderValue, 2550);
});

test('Free delivery applies on orders 5000 TK and above', () => {
  const items = [
    { price: 2500, quantity: 2 }, // 5000
  ];
  const financials = calculateOrderFinancials(items);
  assert.equal(financials.subtotal, 5000);
  assert.equal(financials.deliveryCharge, 0);
  assert.equal(financials.upfrontDue, 0);
  assert.equal(financials.remainingCodDue, 5000);
});

test('formatTaka formats currency with ৳ prefix and comma separators', () => {
  assert.equal(formatTaka(1500), '৳ 1,500');
  assert.equal(formatTaka(150), '৳ 150');
});
