'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import type { User } from '@/types';

function SessionBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const syncAuthUser = useAppStore((state) => state.syncAuthUser);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'authenticated' && session?.user) {
      const sessionUser = session.user;
      const user: User = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name ?? '',
        address: sessionUser.address ?? '',
        phone: sessionUser.phone ?? null,
        isVerified: sessionUser.isVerified,
        hasAcceptedPrivacy: false,
        emailVerifiedAt: null,
      };

      syncAuthUser(user);
      return;
    }

    syncAuthUser(null);
  }, [session, status, syncAuthUser]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionBridge>{children}</SessionBridge>
    </SessionProvider>
  );
}
