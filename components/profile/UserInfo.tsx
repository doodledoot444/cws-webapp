'use client';

import { User } from '@/types';
import { MapPin, Mail, LogOut } from 'lucide-react';

interface UserInfoProps {
  user: User;
  onLogout: () => void;
}

export default function UserInfo({ user, onLogout }: UserInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface rounded-2xl p-5 shadow-sm border border-default">
        <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-4">
          Account Info
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="icon-chip w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary">Email</p>
              <p className="text-sm font-semibold text-primary mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="icon-chip-warm w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary">Home Address</p>
              <p className="text-sm font-semibold text-primary mt-0.5">
                {user.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-danger/35 text-danger font-semibold hover:bg-danger/12 active:scale-95 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
