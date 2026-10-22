/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, CartItem, User, Order, OrderStatus, ActiveView, AuditLogEntry } from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { calculateOrderFinancials, isValidBangladeshiPhone } from '../utils/pricing';
import { FilterCriteria, SortOption } from '../utils/filter';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation & Views
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Filter & Sort State
  filterCriteria: FilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<FilterCriteria>>;
  updateFilter: <K extends keyof FilterCriteria>(key: K, value: FilterCriteria[K]) => void;
  resetFilters: () => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Catalog State
  categories: Category[];
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartFinancials: ReturnType<typeof calculateOrderFinancials>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: (code: string) => boolean;

  // Instant Buy Now
  buyNow: (product: Product, quantity?: number, size?: string, color?: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Authentication & User
  currentUser: User | null;
  login: (identifier: string, pass: string) => boolean;
  signup: (userData: Omit<User, 'id' | 'createdAt' | 'role'> & { password: string }) => boolean;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;

  // Admin Auth with Brute-Force Lockout Protection
  isAdminLoggedIn: boolean;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;
  adminLockoutTimer: number;

  // Orders & Fulfillment Pipeline
  orders: Order[];
  placeOrder: (orderPayload: {
    customerName: string;
    customerPhone: string;
    altPhone?: string;
    customerEmail: string;
    address: { street: string; upazila: string; district: string };
    deliveryNotes?: string;
    paymentMethod: 'bKash' | 'Nagad';
    senderPhone: string;
    transactionId: string;
  }) => Order;
  verifyOrderPayment: (orderId: string) => void;
  declineOrderPayment: (orderId: string, reason: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignCourier: (orderId: string, courier: 'Pathao' | 'Steadfast' | 'RedX', trackingId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, targetId: string, details: string) => void;

  // Database Backup & Restore
  exportDatabaseBackup: () => void;
  restoreDatabase: (jsonString: string) => boolean;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filters & Sorting
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const updateFilter = <K extends keyof FilterCriteria>(key: K, value: FilterCriteria[K]) => {
    setFilterCriteria((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilterCriteria({});
    setSelectedCategoryId(null);
    setSearchTerm('');
  };

  // Sync categoryId filter with selectedCategoryId
  useEffect(() => {
    setFilterCriteria((prev) => ({ ...prev, categoryId: selectedCategoryId }));
  }, [selectedCategoryId]);

  // Sync search filter with searchTerm
  useEffect(() => {
    setFilterCriteria((prev) => ({ ...prev, searchTerm }));
  }, [searchTerm]);

  // Catalog
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('saimx_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('saimx_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('saimx_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('saimx_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Auth
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('saimx_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('saimx_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default user Rafiqul Islam
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Admin Auth & Brute-Force Lockout
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('saimx_admin_logged') === 'true';
  });
  const [adminFailedAttempts, setAdminFailedAttempts] = useState(0);
  const [adminLockoutTimer, setAdminLockoutTimer] = useState(0);

  // Orders & Audit Logs
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('saimx_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('saimx_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Lockout countdown timer
  useEffect(() => {
    let interval: any;
    if (adminLockoutTimer > 0) {
      interval = setInterval(() => {
        setAdminLockoutTimer((t) => Math.max(0, t - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [adminLockoutTimer]);

  // LocalStorage persistence
  useEffect(() => {
    localStorage.setItem('saimx_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('saimx_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('saimx_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('saimx_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('saimx_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('saimx_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('saimx_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('saimx_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('saimx_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('saimx_admin_logged', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Log recording
  const addAuditLog = (action: string, targetId: string, details: string) => {
    const now = new Date();
    const timestamp =
      now.toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      actor: isAdminLoggedIn ? 'Saimxadmin' : currentUser?.name || 'Customer/System',
      action,
      targetId,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is out of stock!`, 'error');
      return;
    }

    const chosenSize = size || (product.sizes && product.sizes[0]);
    const chosenColor = color || (product.colors && product.colors[0]);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Cannot add more than ${product.stock} available units in stock`, 'error');
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.stock), selectedSize: chosenSize, selectedColor: chosenColor }];
      }
    });

    showToast(`Added "${product.name.slice(0, 24)}..." to bag`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    const targetProd = products.find((p) => p.id === productId);
    if (targetProd && quantity > targetProd.stock) {
      showToast(`Only ${targetProd.stock} units currently available`, 'error');
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartFinancials = calculateOrderFinancials(
    cart.map((item) => ({ price: item.product.price, quantity: item.quantity })),
    couponCode
  );

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'SAIMX10' || trimmed === 'WELCOME50' || trimmed === 'EID20') {
      setCouponCode(trimmed);
      showToast(`Coupon "${trimmed}" applied successfully!`, 'success');
      return true;
    } else {
      showToast('Invalid coupon code. Try SAIMX10 or WELCOME50', 'error');
      return false;
    }
  };

  const buyNow = (product: Product, quantity = 1, size?: string, color?: string) => {
    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is out of stock!`, 'error');
      return;
    }
    const chosenSize = size || (product.sizes && product.sizes[0]);
    const chosenColor = color || (product.colors && product.colors[0]);
    setCart([{ product, quantity: 1, selectedSize: chosenSize, selectedColor: chosenColor }]);
    setCurrentView('checkout');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  // User Auth
  const login = (identifier: string, pass: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/[\s-]/g, '') === cleanId.replace(/[\s-]/g, '')
    );

    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    } else {
      showToast('Account not found with this Email or Mobile Number', 'error');
      return false;
    }
  };

  const signup = (
    userData: Omit<User, 'id' | 'createdAt' | 'role'> & { password: string }
  ): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      altPhone: userData.altPhone,
      district: userData.district,
      address: userData.address,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Account created! Welcome to SaiMx, ${newUser.name}!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully', 'success');
  };

  // Admin Auth with Brute-Force Rate Limiting
  const adminLogin = (user: string, pass: string): boolean => {
    if (adminLockoutTimer > 0) {
      showToast(`System locked due to multiple failed attempts. Please wait ${adminLockoutTimer}s.`, 'error');
      return false;
    }

    if (user === 'Saimxadmin' && pass === 'Saimxds@2026') {
      setIsAdminLoggedIn(true);
      setAdminFailedAttempts(0);
      addAuditLog('ADMIN_LOGIN', 'SYSTEM', 'Admin Saimxadmin authenticated successfully.');
      showToast('Admin authentication verified. Welcome to SaiMx Admin!', 'success');
      setCurrentView('admin');
      return true;
    } else {
      const nextFailures = adminFailedAttempts + 1;
      setAdminFailedAttempts(nextFailures);
      if (nextFailures >= 3) {
        setAdminLockoutTimer(30);
        addAuditLog('BRUTE_FORCE_BLOCKED', 'SECURITY', '3 failed admin login attempts. 30s lockout engaged.');
        showToast('Too many invalid login attempts! Locked out for 30 seconds.', 'error');
      } else {
        showToast(`Invalid admin credentials. Attempt ${nextFailures} of 3 before temporary lockout.`, 'error');
      }
      return false;
    }
  };

  const adminLogout = () => {
    addAuditLog('ADMIN_LOGOUT', 'SYSTEM', 'Admin signed out.');
    setIsAdminLoggedIn(false);
    showToast('Admin logged out', 'info');
    setCurrentView('home');
  };

  // Product CRUD with Audit Logging
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    addAuditLog('CREATE_PRODUCT', newProd.id, `Created product "${newProd.name}" (${newProd.price} TK, Stock: ${newProd.stock})`);
    showToast(`Product "${newProd.name.slice(0, 20)}..." created!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog('UPDATE_PRODUCT', id, `Updated attributes: ${Object.keys(updates).join(', ')}`);
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE_PRODUCT', id, `Deleted product "${prod?.name || id}"`);
    showToast('Product deleted', 'info');
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `pr${categories.length + 1}`,
    };
    setCategories((prev) => [...prev, newCat]);
    addAuditLog('CREATE_CATEGORY', newCat.id, `Added category "${newCat.name}"`);
    showToast(`Category "${newCat.name}" added!`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addAuditLog('UPDATE_CATEGORY', id, `Updated category ${id}`);
    showToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DELETE_CATEGORY', id, `Removed category ${id}`);
    showToast('Category removed', 'info');
  };

  // Orders
  const placeOrder = (orderPayload: {
    customerName: string;
    customerPhone: string;
    altPhone?: string;
    customerEmail: string;
    address: { street: string; upazila: string; district: string };
    deliveryNotes?: string;
    paymentMethod: 'bKash' | 'Nagad';
    senderPhone: string;
    transactionId: string;
  }): Order => {
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#SMX-${orderNum}`;
    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      `, ` +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      createdAt: now.toISOString(),
      customerName: orderPayload.customerName,
      customerPhone: orderPayload.customerPhone,
      altPhone: orderPayload.altPhone,
      customerEmail: orderPayload.customerEmail,
      address: orderPayload.address,
      deliveryNotes: orderPayload.deliveryNotes,
      items: [...cart],
      subtotal: cartFinancials.subtotal,
      discount: cartFinancials.discount,
      deliveryChargePaid: cartFinancials.deliveryCharge, // 150 TK upfront
      remainingDueCOD: cartFinancials.remainingCodDue,
      totalOrderValue: cartFinancials.totalOrderValue,
      paymentMethod: orderPayload.paymentMethod,
      senderPhone: orderPayload.senderPhone,
      transactionId: orderPayload.transactionId,
      status: 'Order Placed',
      timeline: [
        {
          status: 'Order Placed',
          time: formattedTime,
          description: `Order placed. Upfront delivery fee (${cartFinancials.deliveryCharge} TK) submitted via ${orderPayload.paymentMethod} (TrxID: ${orderPayload.transactionId})`,
        },
      ],
    };

    // Strict Inventory Decrement
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          const newStock = Math.max(0, prod.stock - cartMatch.quantity);
          const newSold = (prod.soldCount || 0) + cartMatch.quantity;
          return { ...prod, stock: newStock, soldCount: newSold };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    addAuditLog('ORDER_PLACED', orderId, `Customer ${orderPayload.customerName} submitted TrxID ${orderPayload.transactionId}`);
    clearCart();
    setActiveOrderId(newOrder.id);
    setCurrentView('order-success');
    showToast(`Order ${orderId} successfully placed!`, 'success');
    return newOrder;
  };

  const verifyOrderPayment = (orderId: string) => {
    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      `, ` +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Payment Verified',
            timeline: [
              ...o.timeline,
              {
                status: 'Payment Verified',
                time: formattedTime,
                description: `bKash/Nagad 150 TK payment verified by Accounts Team. Order queued for dispatch.`,
              },
            ],
          };
        }
        return o;
      })
    );
    addAuditLog('VERIFY_PAYMENT', orderId, 'Payment verified against merchant account statement.');
    showToast(`Order ${orderId} payment verified & queued for fulfillment!`, 'success');
  };

  const declineOrderPayment = (orderId: string, reason: string) => {
    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      `, ` +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Cancelled',
            rejectionReason: reason || 'Transaction ID could not be verified in merchant statement.',
            timeline: [
              ...o.timeline,
              {
                status: 'Cancelled',
                time: formattedTime,
                description: `Payment verification failed: ${reason || 'Invalid TrxID'}`,
              },
            ],
          };
        }
        return o;
      })
    );

    // Restore stock
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setProducts((prev) =>
        prev.map((p) => {
          const item = targetOrder.items.find((i) => i.product.id === p.id);
          if (item) {
            return { ...p, stock: p.stock + item.quantity };
          }
          return p;
        })
      );
    }

    addAuditLog('DECLINE_PAYMENT', orderId, `Decline reason: ${reason}`);
    showToast(`Order ${orderId} payment declined. Restored inventory stock.`, 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      `, ` +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            timeline: [
              ...o.timeline,
              {
                status,
                time: formattedTime,
                description: `Status updated to ${status}`,
              },
            ],
          };
        }
        return o;
      })
    );
    addAuditLog('ORDER_STATUS_UPDATE', orderId, `Status transitioned to ${status}`);
    showToast(`Order ${orderId} status updated to ${status}`, 'success');
  };

  const assignCourier = (
    orderId: string,
    courier: 'Pathao' | 'Steadfast' | 'RedX',
    trackingId: string
  ) => {
    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      `, ` +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            courier,
            courierConsignmentId: trackingId,
            status: 'Shipped',
            timeline: [
              ...o.timeline,
              {
                status: 'Shipped',
                time: formattedTime,
                description: `Handed over to ${courier}. Consignment ID: ${trackingId}`,
              },
            ],
          };
        }
        return o;
      })
    );
    addAuditLog('COURIER_ASSIGNED', orderId, `Assigned to ${courier} (${trackingId})`);
    showToast(`Order ${orderId} dispatched with ${courier} (${trackingId})!`, 'success');
  };

  const cancelOrder = (orderId: string, reason: string = 'Cancelled upon customer request') => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status === 'Shipped' || targetOrder.status === 'Delivered') {
      showToast('Cannot cancel an order that has already been dispatched with courier.', 'error');
      return;
    }

    const now = new Date();
    const formattedTime =
      now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      `, ` +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Cancelled',
            rejectionReason: reason,
            timeline: [
              ...o.timeline,
              {
                status: 'Cancelled',
                time: formattedTime,
                description: `Order cancelled: ${reason}. Upfront delivery charge refund processed within 24h.`,
              },
            ],
          };
        }
        return o;
      })
    );

    // Restore stock quantities
    setProducts((prev) =>
      prev.map((p) => {
        const item = targetOrder.items.find((i) => i.product.id === p.id);
        if (item) {
          return { ...p, stock: p.stock + item.quantity };
        }
        return p;
      })
    );

    addAuditLog('ORDER_CANCELLED', orderId, `Cancelled: ${reason}. Restored stock.`);
    showToast(`Order ${orderId} has been cancelled and stock restored.`, 'info');
  };

  // Database Backup & Restore
  const exportDatabaseBackup = () => {
    const backupData = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      categories,
      products,
      orders,
      users,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saimx_database_backup_${Date.now()}.json`;
    a.click();
    addAuditLog('DATABASE_BACKUP', 'SYSTEM', 'Full central database JSON backup exported.');
    showToast('Database backup exported successfully!', 'success');
  };

  const restoreDatabase = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.products || !data.categories || !data.orders) {
        showToast('Invalid backup file structure.', 'error');
        return false;
      }
      setCategories(data.categories);
      setProducts(data.products);
      setOrders(data.orders);
      if (data.users) setUsers(data.users);
      if (data.auditLogs) setAuditLogs(data.auditLogs);

      addAuditLog('DATABASE_RESTORE', 'SYSTEM', 'Restored central database from JSON file.');
      showToast('Database successfully restored from backup!', 'success');
      return true;
    } catch {
      showToast('Failed to parse database backup file.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategoryId,
        setSelectedCategoryId,
        selectedProductId,
        setSelectedProductId,
        activeOrderId,
        setActiveOrderId,
        searchTerm,
        setSearchTerm,
        filterCriteria,
        setFilterCriteria,
        updateFilter,
        resetFilters,
        sortBy,
        setSortBy,
        categories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartFinancials,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        setCouponCode,
        applyCoupon,
        buyNow,
        wishlist,
        toggleWishlist,
        currentUser,
        login,
        signup,
        logout,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        adminLockoutTimer,
        orders,
        placeOrder,
        verifyOrderPayment,
        declineOrderPayment,
        updateOrderStatus,
        assignCourier,
        cancelOrder,
        auditLogs,
        addAuditLog,
        exportDatabaseBackup,
        restoreDatabase,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
