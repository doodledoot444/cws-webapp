'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

export default function NotificationsSettings() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <div className="surface-card rounded-2xl">
      <div className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-5 h-5 text-(-primary)" />
          <h2 className="text-sm font-bold text-primary uppercase tracking-wide">
            Notifications
          </h2>
        </div>
        <p className="text-xs text-secondary mb-4 leading-relaxed">
          Control the updates you want to receive while keeping the interface quiet and focused.
        </p>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Order Updates</p>
            <p className="text-xs text-secondary mt-0.5">
              Status changes for your orders
            </p>
          </div>
          <ToggleSwitch
            checked={orderUpdates}
            onChange={setOrderUpdates}
            label="Order Updates"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Promotions</p>
            <p className="text-xs text-secondary mt-0.5">
              Special offers and discounts
            </p>
          </div>
          <ToggleSwitch
            checked={promotions}
            onChange={setPromotions}
            label="Promotions"
          />
        </div>
      </div>
    </div>
  );
}
