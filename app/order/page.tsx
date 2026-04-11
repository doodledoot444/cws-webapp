'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import OrderForm from '@/components/order/OrderForm';
import { ArrowLeft } from 'lucide-react';

export default function OrderPage() {
  const [mounted, setMounted] = useState(false);
  const user = useAppStore((state) => state.user);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.replace('/');
    }
  }, [mounted, status, router]);

  if (!mounted || status === 'loading' || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white h-20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-4 shadow-sm flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">New Order</h1>
      </div>

      <div className="px-5 pt-6">
        <OrderForm />
      </div>

      <BottomNav />
    </div>
  );
}
