'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  fullWidth,
  disabled,
  type = 'button',
  size = 'md',
  className = '',
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const base =
    'inline-flex items-center justify-center rounded-2xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-strong focus:ring-primary shadow-[0_12px_24px_rgba(29,120,242,0.18)]',
    outline:
      'border border-default text-primary hover:bg-surface/80 focus:ring-primary backdrop-blur-sm',
    ghost: 'text-secondary hover:bg-surface/75 focus:ring-default',
    danger: 'bg-danger text-on-primary hover:bg-danger/90 focus:ring-danger',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={reduceMotion || disabled ? undefined : { y: -1 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
