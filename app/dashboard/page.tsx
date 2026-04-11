'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import OrderOverview from '@/components/dashboard/OrderOverview';
import VerificationBanner from '@/components/dashboard/VerificationBanner';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user, orders } = useAppStore();
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
        <div className="bg-white h-28 animate-pulse" />
      </div>
    );
  }

  const userOrders = orders.filter((o) => o.userId === user.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6 shadow-sm">
        <p className="text-sm text-gray-400 mb-1">Good day 👋</p>
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="px-5 pt-6">
        <VerificationBanner />
        <OrderOverview orders={userOrders} />
      </div>

      <BottomNav />
    </div>
  );
}
