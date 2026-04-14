import Link from 'next/link';
import { Order } from '@/types';
import EmptyState from './EmptyState';
import { ChevronRight, Droplets } from 'lucide-react';

interface OrderOverviewProps {
  orders: Order[];
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warning/16 text-warning',
  CONFIRMED: 'bg-success/16 text-success',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderOverview({ orders }: OrderOverviewProps) {
  if (orders.length === 0) {
    return <EmptyState />;
  }

  const [latest, ...rest] = orders;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">
          Latest Order
        </p>
        <Link href={`/order-details/${latest.id}`}>
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-default hover:border-default transition-all active:scale-98">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="icon-chip w-10 h-10 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">
                    {latest.quantity} gallon{latest.quantity > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-secondary">{formatDate(latest.createdAt)}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[latest.status]}`}
              >
                {STATUS_LABELS[latest.status] ?? latest.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-default">
              <span className="text-sm text-secondary">
                ₱{latest.pricePerUnit} × {latest.quantity}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-primary">
                  ₱{latest.total}
                </span>
                <ChevronRight className="w-4 h-4 text-secondary" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Previous orders */}
      {rest.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-3">
            Previous Orders
          </p>
          <div className="flex flex-col gap-2">
            {rest.map((order) => (
              <Link key={order.id} href={`/order-details/${order.id}`}>
                <div className="bg-surface rounded-xl p-4 border border-default flex items-center justify-between hover:border-default transition-all">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      {order.quantity} gallon{order.quantity > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-secondary mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-secondary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
