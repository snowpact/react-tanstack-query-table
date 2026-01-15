import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 border-transparent',
  outline: 'bg-transparent text-gray-700 border-gray-300',
  success: 'bg-green-100 text-green-800 border-transparent',
  warning: 'bg-yellow-100 text-yellow-800 border-transparent',
  danger: 'bg-red-100 text-red-800 border-transparent',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
