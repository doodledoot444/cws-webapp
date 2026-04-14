import { Order } from '@/types';
import { MapPin, Droplets } from 'lucide-react';

interface OrderSummaryProps {
  order: Order;
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  const { address, quantity, pricePerUnit, total, createdAt } = order;

  const fullAddress = [address.block, address.lot, address.street]
    .filter(Boolean)
    .join(', ');

  const formattedDate = new Date(createdAt).toLocaleString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-default">
      <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-default">
          <div className="icon-chip w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">Purified Water</p>
            <p className="text-xs text-secondary mt-0.5">
              {quantity} gallon{quantity > 1 ? 's' : ''} × ₱{pricePerUnit}
            </p>
          </div>
          <p className="text-sm font-bold text-primary">₱{total}</p>
        </div>

        <div className="flex gap-3 pb-4 border-b border-default">
          <div className="icon-chip-warm w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary mb-0.5">
              Delivery Address
            </p>
            <p className="text-sm text-secondary">{fullAddress}</p>
            {address.notes && (
              <p className="text-xs text-secondary mt-1">
                Note: {address.notes}
              </p>
            )}
          </div>
        </div>
        <div className="bg-base rounded-xl p-4 flex justify-between items-center">
          <p className="text-sm font-medium text-secondary">Total Amount</p>
          <p className="text-xl font-bold text-primary">₱{total}</p>
        </div>

        <p className="text-xs text-secondary text-center">
          Ordered on {formattedDate}
        </p>
      </div>
    </div>
  );
}
