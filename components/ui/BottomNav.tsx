'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, User, Settings } from 'lucide-react';

const NAV_LINKS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/order', icon: PlusCircle, label: 'Order' },
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-area-bottom">
      <div className="flex justify-around items-center py-2 pb-3 max-w-md mx-auto">
        {NAV_LINKS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-colors ${
                isActive
                  ? 'text-sky-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
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
