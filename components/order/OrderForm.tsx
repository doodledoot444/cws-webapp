'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, PRICE_PER_UNIT } from '@/store/useAppStore';
import { OrderAddress } from '@/types';
import QuantitySelector from './QuantitySelector';
import Button from '@/components/ui/Button';
import ConfirmationBanner from './ConfirmationBanner';
import { ShieldAlert } from 'lucide-react';

export default function OrderForm() {
  const [street, setStreet] = useState('');
  const [block, setBlock] = useState('');
  const [lot, setLot] = useState('');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const createOrder = useAppStore((state) => state.createOrder);
  const user = useAppStore((state) => state.user);
  const router = useRouter();

  const total = quantity * PRICE_PER_UNIT;
  const isVerified = user?.isVerified ?? false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      return;
    }

    const address: OrderAddress = {
      street,
      block,
      lot,
      ...(notes ? { notes } : {}),
    };
    const order = createOrder(address, quantity);
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
      router.push(`/order-details/${order.id}`);
    }, 2200);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 text-sm';

  return (
    <>
      {showConfirmation && <ConfirmationBanner />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
            Delivery Address
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Street
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Rose Street"
                required
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Block
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Block 1"
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Lot
                </label>
                <input
                  type="text"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                  placeholder="Lot 5"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Landmark or additional directions"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
            Quantity
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Gallons</p>
              <p className="text-xs text-gray-400">₱{PRICE_PER_UNIT} each</p>
            </div>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>
        </div>

        {/* Price summary */}
        <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sky-700">
                {quantity} gallon{quantity > 1 ? 's' : ''} × ₱{PRICE_PER_UNIT}
              </p>
              <p className="text-xs text-sky-500 mt-1">
                Est. delivery: 10–15 minutes
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-sky-500 uppercase tracking-wide">Total</p>
              <p className="text-3xl font-bold text-sky-600">₱{total}</p>
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth size="lg" disabled={!isVerified}>
          Confirm Order
        </Button>

        {!isVerified && (
          <div className="flex items-center gap-2 justify-center text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs font-medium">
              Email verification is required to place orders. Go to{' '}
              <a href="/settings" className="underline font-semibold">
                Settings
              </a>{' '}
              to resend your verification email.
            </p>
          </div>
        )}
      </form>
    </>
  );
}
