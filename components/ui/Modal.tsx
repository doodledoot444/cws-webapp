'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-[#0f172a]/45 backdrop-blur-sm"
            onClick={onClose}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />

          <motion.div
            className="relative w-full sm:max-w-md bg-elevated rounded-t-4xl sm:rounded-4xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] border border-default"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-base" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-base rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>

            <div className="px-6 pb-8 pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
