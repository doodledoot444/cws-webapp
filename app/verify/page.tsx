'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyPageShell status="loading" message="Verifying your email…" />}>
      <VerifyPageContent />
    </Suspense>
  );
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { update } = useSession();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email…');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token. Please use the full link from your email.');
      return;
    }

    const safeToken = token;

    let cancelled = false;

    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify?token=${encodeURIComponent(safeToken)}`);
        const payload = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setStatus('error');
          setMessage(payload.message || 'Verification failed. Please request a new link.');
          return;
        }

        await update({ user: { isVerified: true } });

        setStatus('success');
        setMessage(payload.message || 'Email verified successfully.');
      } catch {
        if (!cancelled) {
          setStatus('error');
          setMessage('Unable to verify your email right now. Please try again later.');
        }
      }
    }

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token, update]);

  return <VerifyPageShell status={status} message={message} />;
}

function VerifyPageShell({
  status,
  message,
}: {
  status: 'loading' | 'success' | 'error';
  message: string;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-7 text-center">
        <div className="flex justify-center mb-5">
          {status === 'loading' && (
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
              <CircleAlert className="w-8 h-8 text-amber-500" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Email Verification</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 text-white px-6 py-3 font-semibold hover:bg-sky-600 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 px-6 py-3 font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
