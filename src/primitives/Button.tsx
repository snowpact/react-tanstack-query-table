/**
 * Built-in Button component
 *
 * STRUCTURE (fixed): layout, sizing, focus states
 * VISUAL (customizable via registry): colors, borders, shadows, rounded
 */

import { forwardRef, type ReactNode, type MouseEventHandler, type MouseEvent } from 'react';

import { getStyles } from '../registry';
import { cn } from '../utils';

// Fixed structural styles - not customizable
// h-8 and gap-1.5 for compact toolbar buttons (matches shadcn sm size)
const STRUCTURE =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap h-8 px-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export type ButtonVariant = 'default' | 'danger' | 'warning' | 'info' | 'success';

export interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  'data-testid'?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      onClick,
      onMouseEnter,
      onMouseLeave,
      disabled,
      className,
      type = 'button',
      title,
      ...props
    },
    ref
  ) => {
    const styles = getStyles();

    // For variants, use variant style which overrides visual + hover
    const isVariant = variant !== 'default';

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        title={title}
        className={cn(
          STRUCTURE, // Fixed layout
          isVariant ? styles.button[variant] : [styles.button.visual, styles.button.hover], // Visual (colors)
          disabled && styles.button.disabled, // Disabled state
          className // Consumer override
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
