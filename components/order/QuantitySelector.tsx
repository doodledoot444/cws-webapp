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
        className="w-11 h-11 rounded-full bg-base flex items-center justify-center text-secondary hover:bg-base active:scale-95 transition-all font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="text-2xl font-bold text-primary w-8 text-center tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-strong active:scale-95 transition-all font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
