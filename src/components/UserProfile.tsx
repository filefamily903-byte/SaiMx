/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Edit2,
  Save,
  ShoppingBag,
  ExternalLink,
  Mail,
  XCircle,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';
import { BANGLADESH_DISTRICTS } from '../data/mockData';
import { OrderStatus, Order } from '../types';

export const UserProfile: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    orders,
    cart,
    updateCartQuantity,
    removeFromCart,
    setCurrentView,
    setActiveOrderId,
    setIsCartOpen,
    cancelOrder,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tracking' | 'profile' | 'cart'>('tracking');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [altPhone, setAltPhone] = useState(currentUser?.altPhone || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Dhaka');
  const [upazila, setUpazila] = useState(currentUser?.address?.upazila || '');
  const [street, setStreet] = useState(currentUser?.address?.street || '');

  // Cancel order modal
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of delivery address / mind');

  // Simulated Email preview modal
  const [emailModalOrder, setEmailModalOrder] = useState<Order | null>(null);

  // User orders
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
          o.customerPhone === currentUser.phone
      )
    : orders;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      altPhone,
      district,
      address: { street, upazila, district },
    });
    setIsEditing(false);
  };

  const getMilestoneIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
      case 'Order Placed':
        return 0;
      case 'Confirmed':
      case 'Payment Verified':
        return 1;
      case 'Processing':
        return 1.5;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* User Header Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#E53935] flex items-center justify-center font-black text-2xl shadow-xs">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentUser?.name || 'Valued Customer'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.phone} • {currentUser?.email}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                District: {currentUser?.district || 'Dhaka'}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 self-start sm:self-auto border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'tracking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#E53935]" />
            <span>Live Orders ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span>Personal Info & Address</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'cart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-slate-600" />
            <span>Saved Bag ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE ORDER TRACKING & MILESTONE PROGRESS BAR */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <Package className="w-5 h-5 text-[#E53935]" />
                <span>Live Order Lifecycle & Tracking</span>
              </h2>
              <p className="text-xs text-slate-500">
                Tracking pipeline: Pending ➔ Confirmed ➔ Shipped ➔ Delivered
              </p>
            </div>
            <span className="text-xs text-slate-400">Real-time status updates</span>
          </div>

          {userOrders.length > 0 ? (
            userOrders.map((order) => {
              const currentMilestone = getMilestoneIndex(order.status);
              const milestones = [
                { label: 'Pending', desc: '150 TK Upfront Received' },
                { label: 'Confirmed', desc: 'TrxID Verified' },
                { label: 'Shipped', desc: 'With Courier Partner' },
                { label: 'Delivered', desc: 'COD Collected' },
              ];

              const canCancel =
                order.status === 'Order Placed' ||
                order.status === 'Pending' ||
                order.status === 'Payment Verified' ||
                order.status === 'Confirmed';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-900">{order.id}</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            order.status === 'Payment Verified' || order.status === 'Confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Shipped'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEmailModalOrder(order)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-200 flex items-center space-x-1"
                        title="Simulated Email Confirmation"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>Email Copy</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveOrderId(order.id);
                          setCurrentView('order-success');
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                      >
                        Digital Memo
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => setCancelTargetId(order.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors border border-red-200 flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* VISUAL MILESTONE PROGRESS BAR */}
                  {order.status !== 'Cancelled' ? (
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {/* Connecting track line */}
                        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                          <div
                            className="h-full bg-[#E53935] transition-all duration-500"
                            style={{
                              width: `${(Math.max(0, currentMilestone) / 3) * 100}%`,
                            }}
                          />
                        </div>

                        {milestones.map((m, idx) => {
                          const isDone = idx <= Math.floor(currentMilestone);
                          const isCurrent = Math.floor(currentMilestone) === idx;
                          return (
                            <div key={m.label} className="flex flex-col items-center text-center relative z-10">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs ${
                                  isDone
                                    ? 'bg-[#E53935] text-white ring-4 ring-red-50'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                              </div>
                              <h5
                                className={`text-xs font-bold mt-2 ${
                                  isCurrent ? 'text-[#E53935]' : isDone ? 'text-slate-800' : 'text-slate-400'
                                }`}
                              >
                                {m.label}
                              </h5>
                              <p className="text-[10px] text-slate-400 hidden sm:block">{m.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-800">
                      <strong>Order Cancelled:</strong> {order.rejectionReason || 'Cancelled upon customer request. Stock restored to inventory.'}
                    </div>
                  )}

                  {/* Courier & Payment Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        Payment Verification Status
                      </span>
                      <p className="font-bold text-slate-800">
                        {order.paymentMethod} (TrxID: {order.transactionId})
                      </p>
                      <p className="text-[11px] text-emerald-700">150 TK Paid Upfront</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        Courier Partner
                      </span>
                      <p className="font-bold text-slate-800">
                        {order.courier ? `${order.courier} Express` : 'Assigned upon confirmation'}
                      </p>
                      {order.courierConsignmentId && (
                        <p className="text-[11px] font-mono text-[#E53935]">
                          Consignment: {order.courierConsignmentId}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                        Cash on Delivery (Remaining Due)
                      </span>
                      <p className="text-sm font-black text-[#E53935]">{formatTaka(order.remainingDueCOD)}</p>
                      <p className="text-[10px] text-slate-400">Pay cash upon home parcel handover</p>
                    </div>
                  </div>

                  {/* Items Ordered Mini View */}
                  <div className="border-t border-slate-100 pt-4">
                    <h5 className="text-xs font-bold text-slate-700 mb-2">Items in this shipment:</h5>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((it, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 bg-[#FDFBF7] p-2 rounded-xl border border-slate-200 text-xs"
                        >
                          <img
                            src={it.product.images[0]}
                            alt={it.product.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 max-w-[200px] truncate">
                              {it.product.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Qty: {it.quantity} • {formatTaka(it.product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No active orders found</h3>
              <p className="text-xs text-slate-500">You haven't placed an order yet.</p>
              <button
                onClick={() => setCurrentView('home')}
                className="px-4 py-2 bg-[#E53935] text-white text-xs font-bold rounded-xl"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERSONAL INFO & EDITABLE ADDRESS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Personal Information & Address</h2>
              <p className="text-xs text-slate-500">Your details auto-fill during checkout for quick ordering.</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Information'}</span>
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile Number (Primary)</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alternative Contact Number</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">District</label>
                <select
                  disabled={!isEditing}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Upazila / Area</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Present Street Address (House, Road)</label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-60"
              />
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 3: SAVED BAG */}
      {activeTab === 'cart' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Saved Cart Items</h2>
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF7] border border-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{it.product.name}</p>
                      <p className="text-[11px] text-[#E53935] font-semibold">{formatTaka(it.product.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() =>
                          updateCartQuantity(it.product.id, it.quantity - 1, it.selectedSize, it.selectedColor)
                        }
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{it.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(it.product.id, it.quantity + 1, it.selectedSize, it.selectedColor)
                        }
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(it.product.id, it.selectedSize, it.selectedColor)}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full py-3 bg-[#E53935] text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Proceed to Checkout Now
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">Your shopping bag is empty.</p>
          )}
        </div>
      )}

      {/* Cancellation Request Modal */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Cancel Order {cancelTargetId}</h3>
              <button onClick={() => setCancelTargetId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you wish to cancel this order? Stock items will be restored to inventory and your upfront 150 TK delivery payment will be queued for wallet refund.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Change of delivery address">Change of delivery address</option>
                <option value="Found an alternative item">Found an alternative item</option>
                <option value="Order placed by mistake">Order placed by mistake</option>
                <option value="Delivery timeline too long">Delivery timeline too long</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  cancelOrder(cancelTargetId, cancelReason);
                  setCancelTargetId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactional Email Preview Modal */}
      {emailModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#E53935]" />
                <span className="text-xs font-black">Transactional Email Log: {emailModalOrder.id}</span>
              </div>
              <button onClick={() => setEmailModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs text-slate-700 max-h-[70vh] overflow-y-auto leading-relaxed">
              <p><strong>To:</strong> {emailModalOrder.customerEmail}</p>
              <p><strong>Subject:</strong> SaiMx Shipment Update for Order {emailModalOrder.id} [{emailModalOrder.status}]</p>
              <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <p>Hello {emailModalOrder.customerName},</p>
                <p>Status: {emailModalOrder.status}</p>
                <p>Payment: {emailModalOrder.paymentMethod} (TrxID: {emailModalOrder.transactionId})</p>
                <p>Upfront Delivery Fee: {formatTaka(emailModalOrder.deliveryChargePaid)} PAID</p>
                <p>Due at Delivery (COD): {formatTaka(emailModalOrder.remainingDueCOD)}</p>
                {emailModalOrder.courier && (
                  <p>Courier: {emailModalOrder.courier} (Tracking: {emailModalOrder.courierConsignmentId})</p>
                )}
                <p>Items: {emailModalOrder.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}</p>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated transactional email generated by SaiMx dispatch engine.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
