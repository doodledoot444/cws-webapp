'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

type RevenuePoint = {
  date: string;
  gallons: number;
  revenue: number;
};

type RevenueAnalytics = {
  timezone: string;
  pricePerGallon: number;
  daily: { gallons: number; revenue: number };
  weekly: { gallons: number; revenue: number };
  monthly: { gallons: number; revenue: number };
  trend: RevenuePoint[];
  generatedAt: string;
};

const POLL_INTERVAL_MS = 15000;

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

function RevenueCard({
  title,
  value,
  gallons,
}: {
  title: string;
  value: number;
  gallons: number;
}) {
  return (
    <div className="bg-surface border border-default rounded-2xl p-4">
      <p className="text-xs text-secondary uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-primary mt-1">{pesoFormatter.format(value)}</p>
      <p className="text-xs text-secondary mt-1">{gallons} gallons sold</p>
    </div>
  );
}

function AnalyticsDashboardComponent() {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        method: 'GET',
        cache: 'no-store',
      });
      const payload = (await response.json()) as RevenueAnalytics & { message?: string };

      if (!response.ok) {
        setError(payload.message || 'Unable to load analytics.');
        return;
      }

      setError('');
      setAnalytics(payload);
    } catch {
      setError('Unable to load analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAnalytics();
    const interval = setInterval(() => {
      void fetchAnalytics();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const maxTrendRevenue = useMemo(() => {
    if (!analytics?.trend.length) {
      return 1;
    }

    return Math.max(...analytics.trend.map((entry) => entry.revenue), 1);
  }, [analytics?.trend]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <RevenueCard
          title="Daily Revenue"
          value={analytics?.daily.revenue || 0}
          gallons={analytics?.daily.gallons || 0}
        />
        <RevenueCard
          title="Weekly Revenue"
          value={analytics?.weekly.revenue || 0}
          gallons={analytics?.weekly.gallons || 0}
        />
        <RevenueCard
          title="Monthly Revenue"
          value={analytics?.monthly.revenue || 0}
          gallons={analytics?.monthly.gallons || 0}
        />
      </div>

      <div className="bg-surface border border-default rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wide">Revenue Trend (7 days)</h2>
          <span className="text-xs text-secondary">
            {analytics ? `₱${analytics.pricePerGallon}/gallon` : 'Loading...'}
          </span>
        </div>

        {loading && !analytics ? (
          <div className="h-28 rounded-xl bg-base animate-pulse" />
        ) : (
          <>
            <div className="h-32 flex items-end gap-2">
              {(analytics?.trend || []).map((entry) => {
                const ratio = entry.revenue / maxTrendRevenue;
                const height = Math.max(8, Math.round(ratio * 100));

                return (
                  <div key={entry.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-md bg-primary/70"
                      style={{ height: `${height}%` }}
                      title={`${entry.date}: ${pesoFormatter.format(entry.revenue)}`}
                    />
                    <span className="text-[10px] text-secondary">
                      {new Date(entry.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-secondary mt-3">
              {analytics
                ? `Updated ${new Date(analytics.generatedAt).toLocaleTimeString('en-PH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} (${analytics.timezone})`
                : 'Waiting for updates...'}
            </p>
          </>
        )}

        {error ? (
          <p className="mt-3 text-xs text-danger bg-danger/12 border border-danger/30 rounded-xl px-3 py-2">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const AnalyticsDashboard = memo(AnalyticsDashboardComponent);
export default AnalyticsDashboard;
