'use client';

import Button from '@/components/ui/Button';
import { Droplets } from 'lucide-react';

interface HeroSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function HeroSection({ onLogin, onRegister }: HeroSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Logo */}
      <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-sky-200">
        <Droplets className="w-12 h-12 text-white" />
      </div>

      <p className="text-sm font-semibold text-sky-500 uppercase tracking-widest mb-3">
        Ceris Water Station
      </p>

      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
        Pure Water,
        <br />
        <span className="text-sky-500">Right to Your Door</span>
      </h1>

      <p className="text-gray-500 text-base mb-10 max-w-xs leading-relaxed">
        Order fresh purified water delivered in minutes. Safe, affordable, and
        hassle-free.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button variant="primary" onClick={onRegister} fullWidth size="lg">
          Get Started
        </Button>
        <Button variant="outline" onClick={onLogin} fullWidth size="lg">
          Sign In
        </Button>
      </div>

      {/* Features row */}
      <div className="flex gap-6 mt-10 text-sm text-gray-400">
        <span>💧 ₱30 / gallon</span>
        <span>⚡ 10–15 min</span>
        <span>✅ Purified</span>
      </div>
    </section>
  );
}
