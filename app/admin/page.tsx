'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import BottomNav from '@/components/ui/BottomNav';

type AdminOrderStatus = 'PENDING' | 'CONFIRMED';

type AdminOrder = {
  id: string;
  userId: string;
  user?: { id: string; email: string; name: string | null };
  address: {
    street?: string;
    block?: string;
    lot?: string;
    notes?: string;
  };
  quantity: number;
  total: number;
  status: AdminOrderStatus;
  createdAt: string;
};

function formatAddress(order: AdminOrder) {
  const address = order.address || {};
  return [address.block, address.lot, address.street].filter(Boolean).join(', ');
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | AdminOrderStatus>('ALL');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [mounted, status, session, router]);

  useEffect(() => {
    if (!mounted || status !== 'authenticated' || session?.user?.role !== 'ADMIN') {
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        const query = statusFilter === 'ALL' ? '' : `?status=${statusFilter}`;
        const response = await fetch(`/api/orders${query}`);
        const payload = await response.json();

        if (!response.ok) {
          setErrorMessage(payload.message || 'Unable to load orders.');
          return;
        }

        setErrorMessage('');
        setOrders(Array.isArray(payload.orders) ? payload.orders : []);
      } catch {
        setErrorMessage('Unable to load orders.');
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
    const interval = setInterval(() => {
      void loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted, status, session, statusFilter]);

  const summary = useMemo(() => {
    let pending = 0;
    let confirmed = 0;

    for (const order of orders) {
      if (order.status === 'PENDING') pending += 1;
      if (order.status === 'CONFIRMED') confirmed += 1;
    }

    return { pending, confirmed };
  }, [orders]);

  async function handleConfirm(orderId: string) {
    try {
      setConfirmingId(orderId);
      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'POST',
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to confirm order.');
        return;
      }

      setErrorMessage('');
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status: 'CONFIRMED' } : order
        )
      );
    } catch {
      setErrorMessage('Unable to confirm order.');
    } finally {
      setConfirmingId(null);
    }
  }

  if (!mounted || status === 'loading') {
    return <div className="min-h-screen bg-base" />;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-base pb-28">
      <div className="bg-surface px-6 pt-14 pb-6 shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-sm text-secondary mt-1">Monitor revenue and manage incoming orders</p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">
        <AnalyticsDashboard />

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface border border-default rounded-2xl p-4">
            <p className="text-xs text-secondary uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-primary mt-1">{summary.pending}</p>
          </div>
          <div className="bg-surface border border-default rounded-2xl p-4">
            <p className="text-xs text-secondary uppercase tracking-wide">Confirmed</p>
            <p className="text-2xl font-bold text-primary mt-1">{summary.confirmed}</p>
          </div>
        </div>

        <div className="bg-surface border border-default rounded-2xl p-3 flex gap-2">
          {(['ALL', 'PENDING', 'CONFIRMED'] as const).map((statusValue) => (
            <button
              key={statusValue}
              type="button"
              onClick={() => setStatusFilter(statusValue)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                statusFilter === statusValue
                  ? 'bg-primary text-on-primary'
                  : 'bg-base text-secondary'
              }`}
            >
              {statusValue}
            </button>
          ))}
        </div>

        {errorMessage && (
          <p className="text-xs text-danger bg-danger/12 border border-danger/30 rounded-xl px-3 py-2">
            {errorMessage}
          </p>
        )}

        <div className="bg-surface border border-default rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-195 text-sm">
              <thead className="bg-base text-secondary text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Address</th>
                  <th className="text-left px-4 py-3">Qty</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {!loading && orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-secondary">
                      No orders found for this filter.
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-default">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary">{order.user?.name || 'Unknown user'}</p>
                      <p className="text-xs text-secondary">{order.user?.email || order.userId}</p>
                    </td>
                    <td className="px-4 py-3 text-secondary">{formatAddress(order)}</td>
                    <td className="px-4 py-3 text-secondary">{order.quantity}</td>
                    <td className="px-4 py-3 text-secondary">PHP {order.total}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'CONFIRMED'
                            ? 'bg-success/16 text-success'
                            : 'bg-warning/16 text-warning'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary">
                      {new Date(order.createdAt).toLocaleString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {order.status === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => void handleConfirm(order.id)}
                          disabled={confirmingId === order.id}
                          className="px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold disabled:opacity-60"
                        >
                          {confirmingId === order.id ? 'Confirming...' : 'Confirm Order'}
                        </button>
                      ) : (
                        <span className="text-xs text-secondary">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
