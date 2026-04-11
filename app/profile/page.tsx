'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import BottomNav from '@/components/ui/BottomNav';
import UserInfo from '@/components/profile/UserInfo';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAppStore();
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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="px-5 pt-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-7">
          <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
            <User className="w-10 h-10 text-sky-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">Customer</p>
        </div>

        <UserInfo user={user} onLogout={handleLogout} />
      </div>

      <BottomNav />
    </div>
  );
}
