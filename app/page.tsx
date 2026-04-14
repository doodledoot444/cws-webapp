'use client';

import { useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import AuthModal from '@/components/auth/AuthModal';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');

  const openModal = (tab: 'login' | 'register') => {
    setDefaultTab(tab);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-base">
      <HeroSection
        onLogin={() => openModal('login')}
        onRegister={() => openModal('register')}
      />
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTab={defaultTab}
      />
    </main>
  );
}
