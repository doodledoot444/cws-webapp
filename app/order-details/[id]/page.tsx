'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import StatusTracker from '@/components/order-details/StatusTracker';
import OrderSummary from '@/components/order-details/OrderSummary';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { status } = useSession();

  const { user, orders, fetchOrders } = useAppStore();
  const isAdminUser = user?.role === 'ADMIN';
  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    if (status === 'authenticated' && isAdminUser) {
      router.replace('/admin');
    }
  }, [status, isAdminUser, router]);

  useEffect(() => {
    if (status !== 'authenticated' || isAdminUser) {
      return;
    }

    void fetchOrders();
    const interval = setInterval(() => {
      void fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [status, isAdminUser, fetchOrders]);

  if (status === 'loading' || isAdminUser) {
    return (
      <div className="min-h-screen bg-base">
        <div className="bg-surface h-20 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center px-6 text-center">
        <p className="text-secondary mb-4">Order not found.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-primary font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base pb-28">
      <div className="bg-surface px-4 pt-14 pb-4 shadow-sm flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-base rounded-xl transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-secondary" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-primary">Order Details</h1>
          <p className="text-xs text-secondary">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">
        <StatusTracker currentStatus={order.status} />
        <OrderSummary order={order} />
      </div>

      <BottomNav />
    </div>
  );
}
