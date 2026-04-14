'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import BottomNav from '@/components/ui/BottomNav';
import UserInfo from '@/components/profile/UserInfo';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-secondary">Loading profile...</p>
      </div>
    );
  }

  const user = {
    ...session.user,
    hasAcceptedPrivacy: true,
    name: session.user.name || 'User',
    address: session.user.address || ''
  };
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-base pb-24">
      <div className="bg-surface px-6 pt-12 pb-5 border-b border-default/50">
        <h1 className="text-xl font-semibold text-primary">Profile</h1>
      </div>

      <div className="px-5 pt-6">
        <UserInfo user={user} onLogout={handleLogout} />
      </div>

      <BottomNav />
    </div>
  );
}