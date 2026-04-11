'use client';

import { useState } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function VerificationBanner() {
  const user = useAppStore((state) => state.user);
  const resendVerification = useAppStore((state) => state.resendVerification);
  const [requesting, setRequesting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [message, setMessage] = useState('');

  const isVerified = user?.isVerified ?? false;

  if (isVerified || dismissed) return null;

  const handleRequest = async () => {
    setRequesting(true);
    setMessage('');
    const result = await resendVerification();
    setMessage(result.message);
    setRequesting(false);
  };

  return (
    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-800">
            Account under verification
          </p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            Your email is not verified yet. You may browse, but ordering is
            temporarily disabled until you confirm your email address.
          </p>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleRequest}
              disabled={requesting}
              className="flex items-center gap-1.5 bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {requesting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Requesting…
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>

            {!requesting && (
              <button
                onClick={() => setDismissed(true)}
                className="text-xs text-amber-500 hover:underline"
              >
                Dismiss
              </button>
            )}
          </div>

          {requesting && (
            <p className="text-xs text-amber-400 mt-2">
              Sending a fresh verification link to your email…
            </p>
          )}

          {!requesting && message && (
            <p className="text-xs text-amber-500 mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
