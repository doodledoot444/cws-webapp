import { CheckCircle } from 'lucide-react';

export default function ConfirmationBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-6 py-4 flex items-start gap-3 shadow-lg animate-banner-down">
      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">Order confirmed!</p>
        <p className="text-xs text-green-100 mt-0.5">
          Your order is now confirmed. Please wait 10 to 15 minutes.
        </p>
      </div>
    </div>
  );
}
