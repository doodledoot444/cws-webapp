import Link from 'next/link';
import { Order } from '@/types';
import EmptyState from './EmptyState';
import { ChevronRight, Droplets } from 'lucide-react';

interface OrderOverviewProps {
  orders: Order[];
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
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
      {/* Latest order card */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Latest Order
        </p>
        <Link href={`/order-details/${latest.id}`}>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-sky-200 transition-all active:scale-98">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {latest.quantity} gallon{latest.quantity > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(latest.createdAt)}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[latest.status]}`}
              >
                {latest.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className="text-sm text-gray-500">
                ₱{latest.pricePerUnit} × {latest.quantity}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-gray-900">
                  ₱{latest.total}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Previous orders */}
      {rest.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Previous Orders
          </p>
          <div className="flex flex-col gap-2">
            {rest.map((order) => (
              <Link key={order.id} href={`/order-details/${order.id}`}>
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:border-sky-200 transition-all">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.quantity} gallon{order.quantity > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
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
