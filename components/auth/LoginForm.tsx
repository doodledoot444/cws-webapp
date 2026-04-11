'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (!result?.error) {
      onSuccess();
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setError(result?.error || 'Invalid email or password. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-5">Sign in to your account</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 text-sm"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        No account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sky-500 font-semibold hover:underline"
        >
          Register
        </button>
      </p>

      <p className="text-xs text-gray-400 text-center bg-gray-50 rounded-lg py-2">
        Sign in using the account you registered and verified by email.
      </p>
    </form>
  );
}
