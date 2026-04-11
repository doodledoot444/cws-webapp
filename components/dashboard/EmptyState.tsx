import Link from 'next/link';
import { Droplets } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-sky-50 rounded-3xl flex items-center justify-center mb-5">
        <Droplets className="w-12 h-12 text-sky-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
      <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
        Place your first order for fresh purified water delivered right to your
        door.
      </p>
      <Link
        href="/order"
        className="bg-sky-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors active:scale-95"
      >
        Order Now
      </Link>
    </div>
  );
}
