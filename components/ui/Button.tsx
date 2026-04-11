'use client';

import React from 'react';

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
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';

  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500',
    outline:
      'border-2 border-sky-500 text-sky-500 hover:bg-sky-50 focus:ring-sky-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
