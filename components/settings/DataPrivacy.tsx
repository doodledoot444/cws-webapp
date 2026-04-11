'use client';

import { Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function DataPrivacy() {
  const user = useAppStore((state) => state.user);
  const acceptPrivacy = useAppStore((state) => state.acceptPrivacy);

  const accepted = user?.hasAcceptedPrivacy ?? false;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-sky-500" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Data Privacy
          </h2>
        </div>

        {/* Notice */}
        <div className="bg-sky-50 rounded-xl p-4 mb-4 border border-sky-100">
          <p className="text-xs font-semibold text-sky-700 mb-2">
            Republic Act 10173 — Data Privacy Act of the Philippines
          </p>
          <ul className="flex flex-col gap-1.5">
            <li className="text-xs text-sky-600 flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">•</span>
              Your personal data is collected solely for order processing and
              delivery purposes.
            </li>
            <li className="text-xs text-sky-600 flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">•</span>
              Your information will not be shared with third parties without
              your explicit consent.
            </li>
            <li className="text-xs text-sky-600 flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">•</span>
              You may request access, correction, or deletion of your data at
              any time.
            </li>
          </ul>
        </div>

        {/* Checkbox */}
        <label
          className={`flex items-start gap-3 ${accepted ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className="mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                if (e.target.checked && !accepted) acceptPrivacy();
              }}
              disabled={accepted}
              className="w-4 h-4 rounded accent-sky-500 cursor-pointer disabled:cursor-default"
              aria-label="Accept Data Privacy Policy"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              I agree to the Data Privacy Policy
            </p>
            {accepted && (
              <p className="text-xs text-green-600 mt-0.5 font-medium">
                ✓ Accepted
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
