import { OrderStatus } from '@/types';
import { Check } from 'lucide-react';

const STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
];

const STATUS_DESC: Record<OrderStatus, string> = {
  PENDING: 'Waiting for station to confirm',
  CONFIRMED: 'Your order has been confirmed',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
};

interface StatusTrackerProps {
  currentStatus: OrderStatus;
}

export default function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm border border-default">
      <h2 className="text-sm font-bold text-primary uppercase tracking-wide mb-5">
        Order Status
      </h2>

      <div className="relative flex flex-col gap-0">
        {STATUS_FLOW.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === STATUS_FLOW.length - 1;

          return (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                        ? 'bg-primary ring-4 ring-base'
                        : 'bg-base'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-on-primary" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 bg-surface rounded-full" />
                  ) : (
                    <div className="w-2.5 h-2.5 bg-default rounded-full" />
                  )}
                </div>

                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-6 my-1 transition-all duration-500 ${
                      isCompleted ? 'bg-primary' : 'bg-base'
                    }`}
                  />
                )}
              </div>

              <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-primary'
                        : 'text-secondary'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </p>
                {(isCurrent || isCompleted) && (
                  <p
                    className={`text-xs mt-0.5 ${
                      isCurrent ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {STATUS_DESC[status]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
