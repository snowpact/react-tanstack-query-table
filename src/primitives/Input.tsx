/**
 * Built-in Input component
 *
 * STRUCTURE (fixed): layout, sizing
 * VISUAL (customizable via registry): colors, borders, rounded, focus ring
 */

import { forwardRef } from 'react';

import { getStyles } from '../registry';
import { cn } from '../utils';

// Fixed structural styles - not customizable (matches shadcn h-9)
const STRUCTURE =
  'flex h-9 w-full min-w-0 px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50';

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
    const styles = getStyles();

    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn(STRUCTURE, styles.input, isActive && styles.state.active, className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
