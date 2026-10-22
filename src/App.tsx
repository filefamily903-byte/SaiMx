/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryCards } from './components/CategoryCards';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B]">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSlider />
            <CategoryCards />
            <ProductGrid />
          </>
        )}

        {currentView === 'checkout' && <CheckoutView />}

        {currentView === 'order-success' && <OrderSuccessModal />}

        {currentView === 'profile' && <UserProfile />}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      {/* Global Overlays & Interactive Components */}
      <ProductDetailModal />
      <CartDrawer />
      <AuthModal />
      <AIAssistantWidget />
      <WhatsAppSupportButton />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
