'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, CircleAlert, Loader2 } from 'lucide-react';

type VerifyStatus = 'loading' | 'success' | 'error';

const verificationCache = new Map<string, { status: VerifyStatus; message: string }>();

export default function VerifyPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-base" />}>
      <VerifyPageContent />
    </Suspense>
  );
}

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { update } = useSession();
  const markUserVerified = useAppStore((state) => state.markUserVerified);

  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [message, setMessage] = useState('Verifying your email…');
  const cachedResult = token ? verificationCache.get(token) : undefined;
  const verifyAttempted = useRef(false);
  const updateRef = useRef(update);
  const markVerifiedRef = useRef(markUserVerified);

  useEffect(() => {
    updateRef.current = update;
    markVerifiedRef.current = markUserVerified;
  }, [update, markUserVerified]);

  useEffect(() => {
    if (!token || cachedResult) {
      return;
    }

    // Guard against React Strict Mode double-invocation which would
    // consume the token on the first call and return "Invalid link" on the second.
    if (verifyAttempted.current) return;
    verifyAttempted.current = true;

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
          const nextMessage = payload.message || 'Verification failed. Please request a new link.';
          verificationCache.set(safeToken, { status: 'error', message: nextMessage });
          setStatus('error');
          setMessage(nextMessage);
          return;
        }

        markVerifiedRef.current();
        await updateRef.current({ user: { isVerified: true } });

        const nextMessage = payload.message || 'Email verified successfully.';
        verificationCache.set(safeToken, { status: 'success', message: nextMessage });
        setStatus('success');
        setMessage(nextMessage);
      } catch {
        if (!cancelled) {
          const nextMessage = 'Unable to verify your email right now. Please try again later.';
          verificationCache.set(safeToken, { status: 'error', message: nextMessage });
          setStatus('error');
          setMessage(nextMessage);
        }
      }
    }

    void verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token, cachedResult]);

  const displayStatus = token
    ? cachedResult?.status ?? status
    : 'error';
  const displayMessage = token
    ? cachedResult?.message ?? message
    : 'Missing verification token. Please use the full link from your email.';

  return <VerifyPageShell status={displayStatus} message={displayMessage} onGoDashboard={() => router.push('/dashboard')} />;
}

function VerifyPageShell({
  status,
  message,
  onGoDashboard,
}: {
  status: VerifyStatus;
  message: string;
  onGoDashboard: () => void;
}) {
  const title = status === 'success' ? 'Account Verified' : 'Email Verification';

  return (
    <main className="min-h-screen bg-base px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-elevated rounded-3xl shadow-sm border border-default p-7 text-center">
        <div className="flex justify-center mb-5">
          {status === 'loading' && (
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 rounded-2xl bg-success/15 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 rounded-2xl bg-warning/15 flex items-center justify-center">
              <CircleAlert className="w-8 h-8 text-warning" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-primary mb-3">{title}</h1>
        <p className="text-sm text-secondary leading-relaxed mb-6">{message}</p>

        <div className="flex flex-col gap-3">
          {status === 'success' ? (
            <button
              onClick={onGoDashboard}
              className="inline-flex items-center justify-center rounded-xl bg-primary text-on-primary px-6 py-3 font-semibold hover:bg-primary-strong transition-colors"
            >
              Go back to dashboard
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-default text-secondary px-6 py-3 font-semibold hover:bg-base transition-colors"
            >
              Back to Sign In
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
