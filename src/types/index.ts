/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  categoryId: string; // e.g. 'pr1', 'pr2', 'pr3', 'pr4', 'pr5'
  brand?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  features: string[];
  images: string[];
  sizes?: string[];
  colors?: string[];
  badge?: 'Flash Sale' | 'Best Seller' | 'Trending' | 'New Arrival' | 'Hot Deal';
  isFlashSale?: boolean;
  soldCount?: number;
  createdAt?: string;
}

export interface Category {
  id: string; // 'pr1', 'pr2', 'pr3', 'pr4', 'pr5'
  name: string;
  displayName: string;
  iconName: string;
  tagline: string;
  itemCount: number;
  bannerImage: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface UserAddress {
  street: string;
  upazila: string;
  district: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  altPhone?: string;
  district: string;
  address: UserAddress;
  role: 'user' | 'admin';
  createdAt: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Order Placed'
  | 'Payment Verified';

export interface Order {
  id: string; // e.g. #SMX-48291
  createdAt: string;
  customerName: string;
  customerPhone: string;
  altPhone?: string;
  customerEmail: string;
  address: UserAddress;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryChargePaid: number; // 150 TK paid upfront
  remainingDueCOD: number; // Cash on delivery
  totalOrderValue: number;
  paymentMethod: 'bKash' | 'Nagad';
  senderPhone: string;
  transactionId: string;
  status: OrderStatus;
  courier?: 'Pathao' | 'Steadfast' | 'RedX';
  courierConsignmentId?: string;
  rejectionReason?: string;
  timeline: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userDistrict: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetId: string;
  details: string;
}

export type ActiveView = 
  | 'home' 
  | 'category' 
  | 'product' 
  | 'checkout' 
  | 'order-success' 
  | 'profile' 
  | 'admin'
  | 'policy-terms'
  | 'policy-privacy'
  | 'policy-returns'
  | 'contact';
