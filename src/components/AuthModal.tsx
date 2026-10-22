/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BANGLADESH_DISTRICTS } from '../data/mockData';
import { isValidBangladeshiPhone, validatePassword } from '../utils/pricing';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    showToast,
  } = useApp();

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('01711223344');
  const [loginPassword, setLoginPassword] = useState('Saimxds@2026');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('');
  const [street, setStreet] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Simulated OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = () => {
    if (!isValidBangladeshiPhone(phone)) {
      showToast('Please enter a valid 11-digit Bangladeshi mobile number first', 'error');
      return;
    }
    setOtpSent(true);
    setOtpCountdown(30);
    // Simulated OTP generated
    const demoOtp = '4821';
    setOtpCode(demoOtp);
    showToast(`Simulated OTP [${demoOtp}] sent to ${phone}!`, 'info');
  };

  const handleVerifyOtp = () => {
    if (otpCode.trim() === '4821' || otpCode.trim().length === 4) {
      setIsOtpVerified(true);
      showToast('Mobile number verified successfully! ✓', 'success');
    } else {
      showToast('Invalid OTP code. Please enter 4821 for demo verification', 'error');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginIdentifier, loginPassword);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!isValidBangladeshiPhone(phone)) {
      showToast('Valid Bangladeshi mobile number required', 'error');
      return;
    }
    if (!isOtpVerified) {
      showToast('Please verify your mobile number with OTP', 'error');
      return;
    }
    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      showToast(passCheck.message, 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    signup({
      name,
      email,
      phone,
      altPhone,
      district,
      address: { street, upazila, district },
      password,
    });
  };

  const fillDemoCustomer = () => {
    setLoginIdentifier('rafiqul@example.com');
    setLoginPassword('Pass1234');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          aria-label="Close auth modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#FDFBF7] px-6 py-5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Sai<span className="text-[#E53935]">Mx</span>
            </span>
            <span className="text-xs font-bold text-slate-400">• Customer Account</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {authModalMode === 'login'
              ? 'Sign in to access your orders, track shipments & manage delivery addresses'
              : 'Create your SaiMx account with instant simulated OTP verification'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-200/60 p-1 mt-4">
            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthModalMode('signup')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authModalMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Customer Registration
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* LOGIN MODE */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email or Mobile Number</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. rafiqul@example.com or 01711223344"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    className="text-[10px] text-[#E53935] font-bold hover:underline flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Fill Demo Customer</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg transition-all"
              >
                Sign In to SaiMx
              </button>
            </form>
          )}

          {/* SIGN UP MODE */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tanvir@example.com"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Mobile Number & Simulated OTP Verification */}
              <div className="space-y-2 p-3 bg-red-50/40 rounded-2xl border border-red-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    Mobile Number (11-digit BD) *
                  </label>
                  {isOtpVerified && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified ✓</span>
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    disabled={isOtpVerified}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01735126250"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                  />

                  <button
                    type="button"
                    disabled={isOtpVerified || otpCountdown > 0}
                    onClick={handleSendOtp}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 shrink-0"
                  >
                    {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : 'Send OTP'}
                  </button>
                </div>

                {otpSent && !isOtpVerified && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="4-digit OTP"
                      className="w-28 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold tracking-widest text-center"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-3 py-1.5 bg-[#E53935] text-white rounded-xl text-xs font-bold hover:bg-red-700"
                    >
                      Verify OTP
                    </button>
                    <span className="text-[10px] text-slate-400">Demo OTP: 4821</span>
                  </div>
                )}
              </div>

              {/* Alternative Number & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Alternative Phone</label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">District *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Present Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Upazila / Thana *</label>
                  <input
                    type="text"
                    required
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    placeholder="e.g. Gulshan"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Street / Road Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Road 11, House 42"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password (8-16 chars) *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Letters + numbers"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-[#FDFBF7] border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E53935] hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all mt-2"
              >
                Complete Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
