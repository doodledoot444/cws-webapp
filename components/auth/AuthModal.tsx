'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: 'login' | 'register';
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Tab switcher */}
      <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTab('login')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'login'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab('register')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            tab === 'register'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Register
        </button>
      </div>

      {tab === 'login' ? (
        <LoginForm
          onSuccess={onClose}
          onSwitchToRegister={() => setTab('register')}
        />
      ) : (
        <RegisterForm
          onSuccess={onClose}
          onSwitchToLogin={() => setTab('login')}
        />
      )}
    </Modal>
  );
}
