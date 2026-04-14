'use client';

import Button from '@/components/ui/Button';
import { Droplets } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroSection({ onLogin, onRegister }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  const motionSafe = <T extends object>(config: T): T =>
    reduceMotion ? ({} as T) : config;

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-10 text-center overflow-hidden">
      <div className="absolute inset-x-0 top-10 mx-auto size-72 rounded-full bg-[radial-gradient(circle,rgba(29,120,242,0.18),transparent_62%)] blur-2xl pointer-events-none" />

      <motion.div
        {...motionSafe(fadeUp())}
        className="surface-card w-full max-w-sm rounded-4xl px-6 py-8 sm:px-8 sm:py-10"
      >
        
        <motion.div
          {...motionSafe({
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.25, delay: 0.05 },
          })}
          className="w-24 h-24 bg-linear-to-br from-(--primary) to-(--primary-strong) rounded-3xl flex items-center justify-center mb-8 shadow-[0_20px_45px_rgba(29,120,242,0.24)] mx-auto"
        >
          <Droplets className="w-12 h-12 text-on-primary" />
        </motion.div>
        <motion.p
          {...motionSafe(fadeUp(0.08))}
          className="text-[11px] font-semibold text-primary uppercase tracking-[0.32em] mb-3"
        >
          Ceris Water Station
        </motion.p>

        <motion.h1
          {...motionSafe(fadeUp(0.12))}
          className="text-[2.4rem] font-bold text-primary mb-4 leading-[1.05] tracking-[-0.04em]"
        >
          Pure Water,
          <br />
          <span className="text-primary">Right to Your Door</span>
        </motion.h1>

        <motion.p
          {...motionSafe(fadeUp(0.16))}
          className="text-secondary text-sm mb-10 max-w-xs leading-relaxed mx-auto"
        >
          Order fresh purified water delivered in minutes. Safe, affordable, and hassle-free.
        </motion.p>

        <motion.div
          {...motionSafe(fadeUp(0.2))}
          className="flex flex-col gap-3 w-full max-w-xs mx-auto"
        >
          <Button variant="primary" onClick={onRegister} fullWidth size="lg">
            Get Started
          </Button>
          <Button variant="outline" onClick={onLogin} fullWidth size="lg">
            Sign In
          </Button>
        </motion.div>
        <motion.div
          {...motionSafe(fadeUp(0.24))}
          className="grid grid-cols-3 gap-2 mt-9 text-[9px] text-secondary"
        >
          {[
            "💧 ₱30 / gallon",
            "⚡ 10–15 min",
            "✅ Purified",
          ].map((item) => (
            <span
              key={item}
              className="rounded-2xl bg-surface/70 border border-default px-3 py-2"
            >
              {item}
            </span>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}