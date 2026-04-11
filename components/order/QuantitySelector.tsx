'use client';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="text-2xl font-bold text-gray-900 w-8 text-center tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 active:scale-95 transition-all font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
