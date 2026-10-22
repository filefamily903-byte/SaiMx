/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CartCalculation {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  upfrontDue: number; // Upfront 150 TK delivery charge
  remainingCodDue: number; // Subtotal - discount
  totalOrderValue: number; // Subtotal - discount + deliveryCharge
}

export const FLAT_DELIVERY_CHARGE = 150;
export const FREE_DELIVERY_THRESHOLD = 5000;
export const MERCHANT_BKASH_NAGAD_NUMBER = '01735126250';

/**
 * Validates Bangladeshi mobile phone numbers:
 * Must be 11 digits starting with 013-019 (e.g. 01735126250)
 */
export function isValidBangladeshiPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim().replace(/[\s-]/g, '');
  return /^01[3-9]\d{8}$/.test(cleanPhone);
}

/**
 * Validates bKash / Nagad Transaction ID:
 * Typically 8 to 12 alphanumeric characters
 */
export function isValidTrxId(trxId: string): boolean {
  if (!trxId) return false;
  const clean = trxId.trim();
  return /^[A-Za-z0-9]{8,14}$/.test(clean);
}

/**
 * Validates password strength (8 to 16 characters with at least one letter and one number)
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8 || password.length > 16) {
    return { isValid: false, message: 'Password must be 8 to 16 characters long' };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: 'Password must contain both letters and numbers' };
  }
  return { isValid: true, message: 'Strong password' };
}

/**
 * Calculates discounts based on coupon code
 */
export function calculateCouponDiscount(code: string | undefined, subtotal: number): number {
  if (!code) return 0;
  const normalized = code.trim().toUpperCase();
  if (normalized === 'SAIMX10') {
    return Math.round(subtotal * 0.1); // 10% discount
  }
  if (normalized === 'WELCOME50') {
    return Math.min(50, subtotal); // 50 TK off
  }
  if (normalized === 'EID20') {
    return Math.round(subtotal * 0.2); // 20% discount
  }
  return 0;
}

/**
 * Calculates order financials:
 * In SaiMx's model, the user pays the 150 TK delivery charge upfront
 * to lock the order, while the remaining balance (subtotal - discount)
 * is paid Cash on Delivery (COD).
 */
export function calculateOrderFinancials(
  items: Array<{ price: number; quantity: number }>,
  couponCode?: string
): CartCalculation {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateCouponDiscount(couponCode, subtotal);
  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Delivery charge is free if total subtotal >= 5000 TK, otherwise 150 TK flat
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : FLAT_DELIVERY_CHARGE;

  // Upfront due is the delivery charge (or 0 if free delivery)
  const upfrontDue = deliveryCharge;

  // Remaining COD due is the items price after discount
  const remainingCodDue = discountedSubtotal;

  const totalOrderValue = discountedSubtotal + deliveryCharge;

  return {
    subtotal,
    discount,
    deliveryCharge,
    upfrontDue,
    remainingCodDue,
    totalOrderValue,
  };
}

/**
 * Formats a number to Bangladeshi Taka format (e.g. ৳ 1,500)
 */
export function formatTaka(amount: number): string {
  return `৳ ${Math.round(amount).toLocaleString('en-US')}`;
}
