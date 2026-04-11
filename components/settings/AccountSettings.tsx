import { User as UserIcon, Phone, MapPin } from 'lucide-react';
import { User } from '@/types';

interface AccountSettingsProps {
  user: User;
}

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function FieldRow({ icon, label, value }: FieldRowProps) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
      <span className="text-xs text-gray-300 self-center">Read-only</span>
    </div>
  );
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Account
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Edit functionality coming soon
        </p>
      </div>

      <div className="px-5 pb-3">
        <FieldRow
          icon={<UserIcon className="w-4 h-4 text-sky-500" />}
          label="Full Name"
          value={user.name}
        />
        <FieldRow
          icon={<Phone className="w-4 h-4 text-sky-500" />}
          label="Phone"
          value={user.phone ?? 'Not provided'}
        />
        <FieldRow
          icon={<MapPin className="w-4 h-4 text-sky-500" />}
          label="Home Address"
          value={user.address}
        />
      </div>
    </div>
  );
}
