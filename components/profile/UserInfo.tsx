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
      {/* Account details card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
          Account Info
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Home Address</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {user.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-red-100 text-red-500 font-semibold hover:bg-red-50 active:scale-95 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
