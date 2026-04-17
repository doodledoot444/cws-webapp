'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import AccountSettings from '@/components/settings/AccountSettings';
import DataPrivacy from '@/components/settings/DataPrivacy';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import VerificationCard from '@/components/settings/VerificationCard';

export default function SettingsPage() {
  const { user } = useAppStore();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen bg-base">
        <div className="bg-surface h-28 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base pb-28">
      <div className="bg-surface px-6 pt-14 pb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">
        <AccountSettings user={user} />
        <VerificationCard />
        <DataPrivacy />
        <NotificationsSettings />
      </div>

      <BottomNav />
    </div>
  );
}
