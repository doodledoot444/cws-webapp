'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, User, Settings, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const NAV_LINKS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/order', icon: PlusCircle, label: 'Order' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

const ADMIN_NAV_LINKS = [
  { href: '/admin', icon: Shield, label: 'Admin Dashboard' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);
  const links = user?.role === 'ADMIN' ? ADMIN_NAV_LINKS : NAV_LINKS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-default z-40 safe-area-bottom">
      <div className="flex justify-around items-center py-2 pb-3 max-w-md mx-auto">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isActive ? 'icon-chip' : 'icon-chip-muted'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
