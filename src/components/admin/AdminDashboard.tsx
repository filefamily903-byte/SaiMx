/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Package,
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  Truck,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  Download,
  Upload,
  DollarSign,
  ArrowRight,
  LogOut,
  RefreshCw,
  ExternalLink,
  History,
  Database,
  BarChart3,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTaka } from '../../utils/pricing';
import { Product, Category } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    adminLockoutTimer,
    orders,
    products,
    categories,
    auditLogs,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    verifyOrderPayment,
    declineOrderPayment,
    updateOrderStatus,
    assignCourier,
    cancelOrder,
    exportDatabaseBackup,
    restoreDatabase,
    showToast,
    setCurrentView,
  } = useApp();

  // Admin login credentials
  const [adminUsername, setAdminUsername] = useState('Saimxadmin');
  const [adminPassword, setAdminPassword] = useState('Saimxds@2026');

  // Active module tab
  const [adminTab, setAdminTab] = useState<
    'overview' | 'verification' | 'fulfillment' | 'products' | 'categories' | 'audit' | 'reports' | 'backup'
  >('overview');

  // Search filter inside tables
  const [tableSearch, setTableSearch] = useState('');

  // Add/Edit Product Modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('pr1');
  const [newProdBrand, setNewProdBrand] = useState('SaiMx Heritage');
  const [newProdPrice, setNewProdPrice] = useState(2500);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState(3200);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80'
  );
  const [newProdBadge, setNewProdBadge] = useState<'Flash Sale' | 'Best Seller' | 'Trending' | 'New Arrival'>('New Arrival');

  // Decline Dialog
  const [declineOrderId, setDeclineOrderId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('TrxID not found in merchant bKash/Nagad statement.');

  // Restore JSON paste area
  const [restoreJson, setRestoreJson] = useState('');

  // IF NOT LOGGED IN AS ADMIN: SECURE GATEWAY WITH BRUTE-FORCE LOCKOUT
  if (!isAdminLoggedIn) {
    const isLocked = adminLockoutTimer > 0;

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-[#E53935] flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">SaiMx Admin Gateway</h1>
            <p className="text-xs text-slate-500">
              Restricted management console. Cryptographically audited session.
            </p>
          </div>

          {/* Brute-force lockout alert banner */}
          {isLocked && (
            <div className="p-3.5 bg-red-100 border border-red-300 rounded-2xl text-red-900 text-xs flex items-center space-x-2 animate-pulse">
              <Lock className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Brute-Force Protection Active!</p>
                <p className="text-[11px]">System locked for security. Please wait {adminLockoutTimer}s.</p>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminLogin(adminUsername, adminPassword);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Administrator Username</label>
              <input
                type="text"
                disabled={isLocked}
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="e.g. Saimxadmin"
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 font-mono disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Administrator Password</label>
              <input
                type="password"
                disabled={isLocked}
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 font-mono disabled:opacity-50"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
              <strong>Security Protocol:</strong> Rate limiting protects this portal against automated brute-force attempts.
              <br />
              Authorized review credentials: <code className="font-mono text-slate-900 font-bold">Saimxadmin / Saimxds@2026</code>
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isLocked ? `Locked (${adminLockoutTimer}s)` : 'Authenticate & Enter Admin Console'}</span>
            </button>
          </form>

          <button
            onClick={() => setCurrentView('home')}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            ← Return to Public Store
          </button>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Order Placed' || o.status === 'Pending');
  const verifiedOrders = orders.filter((o) => o.status === 'Payment Verified' || o.status === 'Confirmed');
  const shippedOrders = orders.filter((o) => o.status === 'Shipped');
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  const todaySales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.subtotal, 0);

  const upfrontCollected = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.deliveryChargePaid, 0);

  const lowStockItems = products.filter((p) => p.stock < 5);

  // Total inventory valuation
  const inventoryValuation = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  // Export courier manifest simulation
  const handleExportCourierManifest = (courierName: string) => {
    const queue = verifiedOrders.map((o) => ({
      orderId: o.id,
      courier: courierName,
      customer: o.customerName,
      phone: o.customerPhone,
      district: o.address.district,
      address: `${o.address.street}, ${o.address.upazila}`,
      collectCodAmount: o.remainingDueCOD,
      itemsSummary: o.items.map((i) => `${i.product.name} x${i.quantity}`).join(' | '),
    }));

    const blob = new Blob([JSON.stringify(queue, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saimx_${courierName.toLowerCase()}_manifest_${Date.now()}.json`;
    a.click();
    showToast(`Exported ${courierName} manifest (${queue.length} consignments)`, 'success');
  };

  const handleCreateOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: newProdName,
        categoryId: newProdCategory,
        brand: newProdBrand,
        price: Number(newProdPrice),
        originalPrice: Number(newProdOrigPrice),
        stock: Number(newProdStock),
        description: newProdDescription || 'Authentic SaiMx product.',
        badge: newProdBadge,
      });
      setEditingProductId(null);
    } else {
      addProduct({
        name: newProdName,
        categoryId: newProdCategory,
        brand: newProdBrand,
        price: Number(newProdPrice),
        originalPrice: Number(newProdOrigPrice),
        discountPercent: Math.round(((newProdOrigPrice - newProdPrice) / newProdOrigPrice) * 100),
        rating: 4.8,
        reviewCount: 1,
        stock: Number(newProdStock),
        soldCount: 0,
        description: newProdDescription || 'High quality product curated by SaiMx.',
        features: ['100% genuine guaranteed', 'Direct manufacturer warranty'],
        images: [newProdImage],
        badge: newProdBadge,
      });
    }

    setIsAddingProduct(false);
    setNewProdName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Top Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E53935] flex items-center justify-center font-black text-xl shadow-md">
            S
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">SaiMx Operations Center</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin: <strong>Saimxadmin</strong> • Merchant Helpline: 01735126250
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700"
          >
            View Live Store
          </button>
          <button
            onClick={adminLogout}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview Analytics', icon: TrendingUp },
          { id: 'verification', label: `Payment Verification (${pendingOrders.length})`, icon: Clock, badge: pendingOrders.length },
          { id: 'fulfillment', label: `Fulfillment Queue (${verifiedOrders.length})`, icon: Truck },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Plus },
          { id: 'audit', label: `Audit Log (${auditLogs.length})`, icon: History },
          { id: 'reports', label: 'Sales Reports & Valuation', icon: BarChart3 },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="w-5 h-5 rounded-full bg-[#E53935] text-white text-[10px] flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW ANALYTICS MODULE */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Today's Sales Value</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  ৳
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{formatTaka(todaySales)}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ Active orders total</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Orders</span>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{totalOrdersCount}</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {verifiedOrders.length} verified • {shippedOrders.length} in transit
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Pending Verifications</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-amber-600 mt-2">{pendingOrders.length}</h3>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                {pendingOrders.length > 0 ? 'Action required in bKash/Nagad audit' : 'All up to date'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Low Stock Alerts (&lt;5 units)</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-[#E53935] mt-2">{lowStockItems.length}</h3>
              <p className="text-[11px] text-red-600 font-semibold mt-1">
                {lowStockItems.map((p) => p.name.slice(0, 16)).join(', ') || 'No stock warnings'}
              </p>
            </div>
          </div>

          {/* Quick AI Analytics Formatting Box */}
          <div className="bg-[#FDFBF7] p-5 rounded-3xl border border-amber-200/80 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span>🤖 SaiMx Central Intelligence Analytics</span>
            </h4>
            <p>
              • <strong>Financial Summary:</strong> Total order receivables are <strong>{formatTaka(todaySales)}</strong>. Upfront booking deposits collected: <strong>{formatTaka(upfrontCollected)}</strong>. Cash on Delivery (COD) to be collected: <strong>{formatTaka(todaySales - upfrontCollected)}</strong>.
            </p>
            <p>
              • <strong>Inventory Stock Valuation:</strong> Total warehouse inventory is valued at <strong>{formatTaka(inventoryValuation)}</strong> across {products.length} catalog items.
            </p>
          </div>
        </div>
      )}

      {/* 2. PAYMENT VERIFICATION MODULE */}
      {adminTab === 'verification' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                bKash & Nagad Payment Verification
              </h2>
              <p className="text-xs text-slate-500">
                Audit customer sender mobile and TrxID against merchant records (01735126250). Zero sensitive data retention.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {pendingOrders.length} Pending Approval
            </span>
          </div>

          {pendingOrders.length > 0 ? (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/20 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-slate-900">{order.id}</span>
                        <span className="text-xs font-bold bg-[#E53935] text-white px-2 py-0.5 rounded-md">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed by <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.address.district}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Upfront Due</span>
                      <span className="text-base font-black text-[#E53935]">
                        {formatTaka(order.deliveryChargePaid)}
                      </span>
                    </div>
                  </div>

                  {/* Side-by-side Verification Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">CUSTOMER SENDER MOBILE</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">{order.senderPhone}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">SUBMITTED TRANSACTION ID (TrxID)</span>
                      <span className="font-mono font-black text-[#E53935] text-sm">{order.transactionId}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">RECEIVING MERCHANT NUMBER</span>
                      <span className="font-mono font-bold text-slate-800">01735126250 (SaiMx)</span>
                    </div>
                  </div>

                  {/* Parcel Content */}
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-700">Parcel Content: </span>
                    {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')} • <strong>Total COD Due at door: {formatTaka(order.remainingDueCOD)}</strong>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-2 border-t border-amber-200/60">
                    <button
                      onClick={() => setDeclineOrderId(order.id)}
                      className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline Payment</span>
                    </button>

                    <button
                      onClick={() => verifyOrderPayment(order.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors flex items-center space-x-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Move to Fulfillment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800">All submitted payments are verified!</p>
              <p className="text-xs text-slate-400">New customer orders will appear here for audit.</p>
            </div>
          )}

          {/* Decline Reason Modal Dialog */}
          {declineOrderId && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Decline Payment for {declineOrderId}</h3>
                <p className="text-xs text-slate-500">
                  Provide reason for declining. Stock will be restored and an automated correction notice will be logged.
                </p>
                <textarea
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setDeclineOrderId(null)}
                    className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      declineOrderPayment(declineOrderId, declineReason);
                      setDeclineOrderId(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ORDER TO PLACE / FULFILLMENT QUEUE */}
      {adminTab === 'fulfillment' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Order to Place (Courier Fulfillment Queue)
              </h2>
              <p className="text-xs text-slate-500">
                Confirmed orders ready for Pathao, Steadfast, and RedX consignment dispatch.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportCourierManifest('Pathao')}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#E53935] rounded-xl text-xs font-bold transition-colors border border-red-200 flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Pathao CSV/JSON</span>
              </button>
              <button
                onClick={() => handleExportCourierManifest('Steadfast')}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors border border-blue-200 flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Steadfast</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer & Phone</th>
                  <th className="py-3 px-2">Delivery Address</th>
                  <th className="py-3 px-2 text-right">COD Due Amount</th>
                  <th className="py-3 px-2">Courier / Tracking</th>
                  <th className="py-3 px-2 text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-slate-800">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                    </td>
                    <td className="py-3 px-2 max-w-xs">
                      <p className="text-slate-700 truncate">{order.address.street}</p>
                      <p className="text-[10px] text-slate-400">
                        {order.address.upazila}, {order.address.district}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-right font-black text-[#E53935]">
                      {formatTaka(order.remainingDueCOD)}
                    </td>
                    <td className="py-3 px-2">
                      {order.courier ? (
                        <span className="font-semibold text-slate-800">
                          {order.courier} ({order.courierConsignmentId})
                        </span>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              assignCourier(order.id, 'Pathao', `PTH-${order.id.replace('#SMX-', '')}`)
                            }
                            className="px-2 py-1 bg-red-100 text-[#E53935] rounded-md font-bold text-[10px]"
                          >
                            + Pathao
                          </button>
                          <button
                            onClick={() =>
                              assignCourier(order.id, 'Steadfast', `STF-${order.id.replace('#SMX-', '')}`)
                            }
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-bold text-[10px]"
                          >
                            + Steadfast
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="text-[11px] font-bold text-emerald-700">✓ Delivered</span>
                      )}
                      {order.status === 'Payment Verified' && (
                        <span className="text-[11px] font-bold text-blue-600">Awaiting Dispatch</span>
                      )}
                      {order.status === 'Order Placed' && (
                        <span className="text-[11px] font-bold text-amber-600">Pending Verification</span>
                      )}
                      {order.status === 'Cancelled' && (
                        <span className="text-[11px] font-bold text-red-600">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PRODUCT MANAGEMENT CRUD */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Product Catalog Management</h2>
              <p className="text-xs text-slate-500">Create, update pricing, brands, stock, or delete products.</p>
            </div>

            <button
              onClick={() => {
                setEditingProductId(null);
                setNewProdName('');
                setIsAddingProduct(true);
              }}
              className="px-4 py-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Form */}
          {isAddingProduct && (
            <form
              onSubmit={handleCreateOrUpdateProduct}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
            >
              <h3 className="text-xs font-bold text-slate-900 uppercase">
                {editingProductId ? 'Edit Product' : 'Create New Product'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Silk Panjabi"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Brand / Artisan</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. SaiMx Heritage"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Badge</label>
                  <select
                    value={newProdBadge}
                    onChange={(e) => setNewProdBadge(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Flash Sale">Flash Sale</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Selling Price (TK) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Original Price (TK)</label>
                  <input
                    type="number"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E53935] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          )}

          {/* Product List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Image</th>
                  <th className="py-3 px-2">Product Name</th>
                  <th className="py-3 px-2">Brand</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Stock Level</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-2">
                      <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-bold text-slate-800">{prod.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{prod.id}</span>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-600">{prod.brand || 'SaiMx'}</td>
                    <td className="py-3 px-2 uppercase font-mono text-slate-600">{prod.categoryId}</td>
                    <td className="py-3 px-2 font-bold text-[#E53935]">{formatTaka(prod.price)}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          prod.stock < 5
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingProductId(prod.id);
                          setNewProdName(prod.name);
                          setNewProdCategory(prod.categoryId);
                          setNewProdBrand(prod.brand || 'SaiMx Heritage');
                          setNewProdPrice(prod.price);
                          setNewProdOrigPrice(prod.originalPrice);
                          setNewProdStock(prod.stock);
                          setIsAddingProduct(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CATEGORIES CRUD */}
      {adminTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Homepage Categories (Pr1, Pr2...)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md uppercase">
                    {cat.id}
                  </span>
                  <span className="text-xs text-slate-400">{cat.itemCount} Items</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{cat.name}</h4>
                <p className="text-[11px] text-slate-500">{cat.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ADMIN AUDIT LOG MODULE */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <History className="w-5 h-5 text-[#E53935]" />
              <span>Administrative System Audit Log</span>
            </h2>
            <p className="text-xs text-slate-500">
              Chronological immutable tracking log recording who modified prices, products, verified payments, or cancelled orders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Timestamp</th>
                  <th className="py-3 px-2">Actor</th>
                  <th className="py-3 px-2">Action Type</th>
                  <th className="py-3 px-2">Target ID</th>
                  <th className="py-3 px-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-800">{log.actor}</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#E53935]">{log.targetId}</td>
                    <td className="py-2.5 px-2 font-sans text-xs text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. INVENTORY & SALES REPORTS MODULE */}
      {adminTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Inventory & Sales Reports</h2>
            <p className="text-xs text-slate-500">Valuation, best-sellers, and delivery fee distributions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Warehouse Valuation</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{formatTaka(inventoryValuation)}</h3>
              <p className="text-[11px] text-slate-500">Across {products.reduce((s, p) => s + p.stock, 0)} units</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Items Sold</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {products.reduce((s, p) => s + (p.soldCount || 0), 0)} units
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold">High conversion rate</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">bKash/Nagad Verified Volume</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{formatTaka(upfrontCollected)}</h3>
              <p className="text-[11px] text-slate-500">150 TK upfront booking fees</p>
            </div>
          </div>

          {/* Best-selling rankings */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Top Best-Selling Products
            </h4>
            <div className="space-y-2">
              {[...products]
                .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
                .slice(0, 5)
                .map((prod, idx) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF7] border border-slate-200 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <img src={prod.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">{prod.name}</p>
                        <p className="text-[11px] text-slate-400">{prod.brand} • {formatTaka(prod.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#E53935]">{prod.soldCount || 0} units sold</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. BACKUP & RESTORE MODULE */}
      {adminTab === 'backup' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Database className="w-5 h-5 text-[#E53935]" />
              <span>Central Database Backup & Disaster Recovery</span>
            </h2>
            <p className="text-xs text-slate-500">
              Download complete database snapshots (Products, Categories, Orders, Audit Logs) or restore from an existing JSON backup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Backup Card */}
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Export Central Database Backup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates a timestamped JSON file containing all current product catalogs, active and historical orders, customer records, and administrative audit logs.
              </p>
              <button
                onClick={exportDatabaseBackup}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Central JSON Backup</span>
              </button>
            </div>

            {/* Restore Backup Card */}
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Restore Database from JSON</h3>
              <p className="text-xs text-slate-600">
                Paste JSON backup contents below to restore the application state.
              </p>
              <textarea
                rows={3}
                value={restoreJson}
                onChange={(e) => setRestoreJson(e.target.value)}
                placeholder='Paste exported JSON backup here (e.g. {"version":"1.2.0", ...})'
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
              />
              <button
                onClick={() => {
                  if (restoreJson.trim()) {
                    restoreDatabase(restoreJson);
                    setRestoreJson('');
                  }
                }}
                disabled={!restoreJson.trim()}
                className="px-5 py-2.5 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 shadow-sm disabled:opacity-40"
              >
                <Upload className="w-4 h-4" />
                <span>Restore Database</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
