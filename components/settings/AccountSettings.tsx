'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User as UserIcon, Phone, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { User } from '@/types';

interface AccountSettingsProps {
  user: User;
}

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface EditableFieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function FieldRow({ icon, label, value }: FieldRowProps) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-default last:border-0">
      <div className="icon-chip-muted w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-secondary mb-0.5">{label}</p>
        <p className="text-sm font-medium text-primary truncate">{value}</p>
      </div>
      
    </div>
  );
}

function EditableFieldRow({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: EditableFieldRowProps) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-default last:border-0">
      <div className="icon-chip-muted w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-secondary mb-1">{label}</p>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-primary outline-none focus:border-primary/60"
        />
      </div>
    </div>
  );
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const { update } = useSession();
  const syncAuthUser = useAppStore((state) => state.syncAuthUser);

  const initialForm = useMemo(
    () => ({
      name: user.name,
      phone: user.phone ?? '',
      address: user.address,
    }),
    [user.name, user.phone, user.address]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isEditing) {
      setForm(initialForm);
    }
  }, [initialForm, isEditing]);

  const handleCancel = () => {
    setError('');
    setSuccess('');
    setForm(initialForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const trimmedAddress = form.address.trim();
    const trimmedPhone = form.phone.trim();

    if (!trimmedName || !trimmedAddress) {
      setError('Name and home address are required.');
      setSuccess('');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone || null,
          address: trimmedAddress,
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        user?: Pick<User, 'name' | 'phone' | 'address'>;
      };

      if (!response.ok || !payload.user) {
        setError(payload.message || 'Unable to update account right now.');
        return;
      }

      const updatedUser: User = {
        ...user,
        name: payload.user.name,
        phone: payload.user.phone ?? null,
        address: payload.user.address,
      };

      syncAuthUser(updatedUser);
      await update({
        user: {
          name: payload.user.name,
          phone: payload.user.phone,
          address: payload.user.address,
        },
      });

      setSuccess(payload.message || 'Account details updated.');
      setIsEditing(false);
    } catch {
      setError('Unable to update account right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-default overflow-hidden">
      <div className="px-5 pt-5 pb-2 flex items-start justify-between gap-3">
        <div>
        <h2 className="text-sm font-bold text-primary uppercase tracking-wide">
          Account
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Keep your details up to date
        </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => {
              setError('');
              setSuccess('');
              setIsEditing(true);
            }}
            className="rounded-lg border border-default px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-base transition-colors"
          >
            Edit
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mx-5 mt-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mx-5 mt-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">
          {success}
        </div>
      ) : null}

      <div className="px-5 pb-3">
        {isEditing ? (
          <>
            <EditableFieldRow
              icon={<UserIcon className="w-4 h-4" />}
              label="Full Name"
              value={form.name}
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              placeholder="Enter full name"
            />
            <EditableFieldRow
              icon={<Phone className="w-4 h-4 text-(-color-accent)" />}
              label="Phone"
              value={form.phone}
              onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
              placeholder="Enter phone number"
            />
            <EditableFieldRow
              icon={<MapPin className="w-4 h-4" />}
              label="Home Address"
              value={form.address}
              onChange={(value) => setForm((prev) => ({ ...prev, address: value }))}
              placeholder="Enter home address"
            />

            <div className="flex gap-2 pt-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-lg bg-primary text-on-primary px-4 py-2.5 text-sm font-semibold hover:bg-primary-strong disabled:opacity-70 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-lg border border-default px-4 py-2.5 text-sm font-semibold text-secondary hover:bg-base disabled:opacity-70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <FieldRow
              icon={<UserIcon className="w-4 h-4" />}
              label="Full Name"
              value={user.name}
            />
            <FieldRow
              icon={<Phone className="w-4 h-4 text-(-color-accent)" />}
              label="Phone"
              value={user.phone ?? 'Not provided'}
            />
            <FieldRow
              icon={<MapPin className="w-4 h-4" />}
              label="Home Address"
              value={user.address}
            />
          </>
        )}
      </div>
    </div>
  );
}
