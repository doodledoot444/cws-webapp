'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import OrderForm from '@/components/order/OrderForm';
import { ArrowLeft } from 'lucide-react';

export default function OrderPage() {
  const user = useAppStore((state) => state.user);
  const { status } = useSession();
  const router = useRouter();
  const isAdminUser = user?.role === 'ADMIN';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    if (status === 'authenticated' && isAdminUser) {
      router.replace('/admin');
    }
  }, [status, isAdminUser, router]);

  if (status === 'loading' || !user || isAdminUser) {
    return (
      <div className="min-h-screen bg-base">
        <div className="bg-surface h-20 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base pb-28">
      <div className="bg-surface px-4 pt-14 pb-4 shadow-sm flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-base rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-secondary" />
        </button>
        <h1 className="text-xl font-bold text-primary">New Order</h1>
      </div>

      <div className="px-5 pt-6">
        <OrderForm />
      </div>

      <BottomNav />
    </div>
  );
}
