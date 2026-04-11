import { OrderStatus } from '@/types';
import { Check } from 'lucide-react';

const STATUS_FLOW: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'In Progress',
  'Completed',
];

const STATUS_DESC: Record<OrderStatus, string> = {
  Pending: 'Waiting for station to confirm',
  Confirmed: 'Your order has been confirmed',
  'In Progress': 'Rider is on the way',
  Completed: 'Order delivered successfully!',
};

interface StatusTrackerProps {
  currentStatus: OrderStatus;
}

export default function StatusTracker({ currentStatus }: StatusTrackerProps) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-5">
        Order Status
      </h2>

      <div className="relative flex flex-col gap-0">
        {STATUS_FLOW.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          const isLast = index === STATUS_FLOW.length - 1;

          return (
            <div key={status} className="flex gap-4">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 ${
                    isCompleted
                      ? 'bg-sky-500'
                      : isCurrent
                        ? 'bg-sky-500 ring-4 ring-sky-100'
                        : 'bg-gray-100'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  ) : (
                    <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                  )}
                </div>

                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-6 my-1 transition-all duration-500 ${
                      isCompleted ? 'bg-sky-500' : 'bg-gray-100'
                    }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                <p
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isCurrent
                      ? 'text-sky-600'
                      : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-400'
                  }`}
                >
                  {status}
                </p>
                {(isCurrent || isCompleted) && (
                  <p
                    className={`text-xs mt-0.5 ${
                      isCurrent ? 'text-sky-400' : 'text-gray-400'
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
