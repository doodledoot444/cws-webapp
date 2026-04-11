'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import { OrderStatus } from '@/types';
import BottomNav from '@/components/ui/BottomNav';
import StatusTracker from '@/components/order-details/StatusTracker';
import OrderSummary from '@/components/order-details/OrderSummary';
import { ArrowLeft } from 'lucide-react';

const STATUS_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'In Progress',
  'Completed',
];

// Delays (ms) between each status transition from the current one
const TRANSITION_DELAYS = [5000, 10000, 16000];

export default function OrderDetailsPage() {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { status } = useSession();

  const { orders, updateOrderStatus } = useAppStore();
  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.replace('/');
    }
  }, [mounted, status, router]);

  // Simulate status progression from the current status
  useEffect(() => {
    if (!order || order.status === 'Completed') return;

    const currentIndex = STATUS_FLOW.indexOf(order.status);
    if (currentIndex < 0) return;

    const remaining = STATUS_FLOW.slice(currentIndex + 1);
    const timeouts = remaining.map((status, i) =>
      setTimeout(() => updateOrderStatus(orderId, status), TRANSITION_DELAYS[i])
    );

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white h-20 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sky-500 font-semibold"
        >
          Back to Dashboard
        </button>
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
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          <p className="text-xs text-gray-400">#{order.id.slice(-8).toUpperCase()}</p>
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
