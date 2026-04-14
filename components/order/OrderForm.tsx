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
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const createOrder = useAppStore((state) => state.createOrder);
  const user = useAppStore((state) => state.user);
  const router = useRouter();

  const total = quantity * PRICE_PER_UNIT;
  const isVerified = user?.isVerified ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      return;
    }

    if (submitting) {
      return;
    }

    const address: OrderAddress = {
      street,
      block,
      lot,
      ...(notes ? { notes } : {}),
    };
    setSubmitting(true);
    setErrorMessage('');
    const result = await createOrder(address, quantity);
    setSubmitting(false);

    if (!result.success || !result.order) {
      setErrorMessage(result.message || 'Unable to place order right now.');
      return;
    }

    const order = result.order;
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
      router.push(`/order-details/${order.id}`);
    }, 2200);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-default focus:outline-none focus:ring-2 focus:ring-primary text-primary text-sm';

  return (
    <>
      {showConfirmation && <ConfirmationBanner />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-default">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
            Delivery Address
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">
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
                <label className="block text-sm font-medium text-secondary mb-1.5">
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
                <label className="block text-sm font-medium text-secondary mb-1.5">
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
              <label className="block text-sm font-medium text-secondary mb-1.5">
                Notes{' '}
                <span className="text-secondary font-normal">(optional)</span>
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

        <div className="bg-surface rounded-2xl p-5 shadow-sm border border-default">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">
            Quantity
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Gallons</p>
              <p className="text-xs text-secondary">₱{PRICE_PER_UNIT} each</p>
            </div>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-5 border border-default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {quantity} gallon{quantity > 1 ? 's' : ''} × ₱{PRICE_PER_UNIT}
              </p>
              <p className="text-xs text-primary mt-1">
                Est. delivery: 10–15 minutes
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary uppercase tracking-wide">Total</p>
              <p className="text-3xl font-bold text-primary">₱{total}</p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          disabled={!isVerified || submitting}
        >
          Confirm Order
        </Button>

        {errorMessage && (
          <p className="text-xs text-center text-danger">{errorMessage}</p>
        )}

        {!isVerified && (
          <div className="flex items-center gap-2 justify-center text-warning bg-warning/12 border border-warning/30 rounded-xl px-4 py-3">
            <ShieldAlert className="w-4 h-4 shrink-0" />
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
