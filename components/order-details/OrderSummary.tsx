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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4">
        {/* Item row */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
          <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Droplets className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Purified Water</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {quantity} gallon{quantity > 1 ? 's' : ''} × ₱{pricePerUnit}
            </p>
          </div>
          <p className="text-sm font-bold text-gray-900">₱{total}</p>
        </div>

        {/* Address row */}
        <div className="flex gap-3 pb-4 border-b border-gray-50">
          <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0.5">
              Delivery Address
            </p>
            <p className="text-sm text-gray-500">{fullAddress}</p>
            {address.notes && (
              <p className="text-xs text-gray-400 mt-1">
                Note: {address.notes}
              </p>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-600">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">₱{total}</p>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Ordered on {formattedDate}
        </p>
      </div>
    </div>
  );
}
