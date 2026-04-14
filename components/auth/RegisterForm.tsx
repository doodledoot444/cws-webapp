'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAppStore } from '@/store/useAppStore';
import Button from '@/components/ui/Button';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useAppStore((state) => state.register);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    const result = await register(name, email, password, address);
    setLoading(false);

    if (result.success) {
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Account created, but automatic sign-in failed. Please sign in manually.');
        setLoading(false);
        return;
      }

      setNotice(
        result.message ||
          'Account created. Please check your email to verify your account.'
      );
      onSuccess();
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setError(result.message || 'Registration failed. Please try again.');
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-default focus:outline-none focus:ring-2 focus:ring-primary text-primary text-sm';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold text-primary mb-1">Create account</h2>
        <p className="text-sm text-secondary mb-5">Join Ceris Water Station</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan dela Cruz"
          required
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 characters"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1.5">
          Home Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Block 1, Lot 5, Rose St., Brgy."
          required
          autoComplete="street-address"
          className={inputClass}
        />
      </div>

      {error && (
        <div className="bg-danger/12 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {notice && (
        <div className="bg-info/12 border border-info/30 text-info text-sm rounded-xl px-4 py-3">
          {notice}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary font-semibold hover:underline"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
