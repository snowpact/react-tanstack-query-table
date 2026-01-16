/**
 * Built-in Input component
 */

import { forwardRef } from 'react';

import { cn } from '../utils';

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  /** Show active state (e.g., when input has content) */
  isActive?: boolean;
  'data-testid'?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, onKeyDown, placeholder, className, type = 'text', isActive, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn('snow-input', isActive && 'snow-state-active', className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
