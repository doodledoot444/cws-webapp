import Link from 'next/link';
import { Droplets } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="icon-chip w-24 h-24 rounded-3xl flex items-center justify-center mb-5">
        <Droplets className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">No orders yet</h3>
      <p className="text-sm text-secondary mb-8 max-w-xs leading-relaxed">
        Place your first order for fresh purified water delivered right to your
        door.
      </p>
      <Link
        href="/order"
        className="bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary-strong transition-colors active:scale-95"
      >
        Order Now
      </Link>
    </div>
  );
}
