'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import OrderOverview from '@/components/dashboard/OrderOverview';
import VerificationBanner from '@/components/dashboard/VerificationBanner';
import NotificationBell from '@/components/dashboard/NotificationBell';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardPageSkeleton />}>
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const [verifiedNoticeVisible, setVerifiedNoticeVisible] = useState(true);
  const {
    user,
    orders,
    notifications,
    unreadNotificationsCount,
    fetchOrders,
    fetchNotifications,
    markNotificationAsRead,
  } = useAppStore();
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifiedFromQuery = searchParams.get('verified') === '1';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    void fetchOrders();
    void fetchNotifications();

    const interval = setInterval(() => {
      void fetchOrders();
      void fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [status, fetchOrders, fetchNotifications]);

  if (status === 'loading' || !user) {
    return <DashboardPageSkeleton />;
  }

  const userOrders = orders;

  return (
    <div className="min-h-screen bg-base pb-28">
      <div className="bg-surface px-6 pt-14 pb-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">{user.name}</h1>
            <p className="text-sm text-secondary mt-1">
              {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadNotificationsCount}
            onMarkAsRead={(id) => {
              void markNotificationAsRead(id);
            }}
          />
        </div>
      </div>

      <div className="px-5 pt-6">
        {verifiedFromQuery && verifiedNoticeVisible && (
          <div className="mb-4 bg-success/12 border border-success/30 rounded-2xl p-4">
            <p className="text-sm font-semibold text-primary">
              Your account is now verified. You can place orders immediately.
            </p>
            <button
              type="button"
              onClick={() => setVerifiedNoticeVisible(false)}
              className="mt-1 text-xs text-success hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <VerificationBanner />
        <OrderOverview orders={userOrders} />
      </div>

      <BottomNav />
    </div>
  );
}

function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-base">
      <div className="bg-surface h-28 animate-pulse" />
    </div>
  );
}
