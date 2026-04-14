'use client';

import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function VerificationCard() {
  const user = useAppStore((state) => state.user);
  const resendVerification = useAppStore((state) => state.resendVerification);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const isVerified = user?.isVerified ?? false;

  const handleRequest = async () => {
    setRequesting(true);
    setMessage('');
    const result = await resendVerification();
    setMessage(result.message);
    setRequesting(false);
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-default">
      <div className="px-5 pt-5 pb-5">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
          Account Verification
        </h2>

        {isVerified ? (
          <div className="flex items-center gap-3 bg-success/12 border border-success/30 rounded-xl p-4">
            <ShieldCheck className="w-6 h-6 text-success shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">
                Email Verified
              </p>
              <p className="text-xs text-secondary mt-0.5">
                Your email has been confirmed. You can place and track orders.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-warning/12 border border-warning/30 rounded-xl p-4">
              <ShieldAlert className="w-6 h-6 text-warning shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  Email Verification Pending
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  Request a verification link to your email. Ordering stays
                  disabled until you confirm that link.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequest}
              disabled={requesting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-xl font-semibold text-sm hover:bg-primary-strong active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {requesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Requesting…
                </>
              ) : (
                'Request Verification Email'
              )}
            </button>

            {requesting && (
              <p className="text-xs text-secondary text-center">
                Sending verification email…
              </p>
            )}

            {!requesting && message && (
              <p className="text-xs text-center text-info">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
