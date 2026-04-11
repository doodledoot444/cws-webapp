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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-5 pt-5 pb-5">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          Account Verification
        </h2>

        {isVerified ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4">
            <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Email Verified
              </p>
              <p className="text-xs text-green-600 mt-0.5">
                Your email has been confirmed. You can place and track orders.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Email Verification Pending
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  We sent a verification link to your email. Ordering stays
                  disabled until you confirm that link.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequest}
              disabled={requesting}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-sky-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {requesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Requesting…
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>

            {requesting && (
              <p className="text-xs text-gray-400 text-center">
                Sending a fresh verification email…
              </p>
            )}

            {!requesting && message && (
              <p className="text-xs text-center text-sky-600">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
