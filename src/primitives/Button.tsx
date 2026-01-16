/**
 * Built-in Button component
 */

import { forwardRef, type ReactNode, type MouseEventHandler, type MouseEvent } from 'react';

import { cn } from '../utils';

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

const variantClasses: Record<ButtonVariant, string> = {
  default: '',
  danger: 'snow-btn-danger',
  warning: 'snow-btn-warning',
  info: 'snow-btn-info',
  success: 'snow-btn-success',
};

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
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        title={title}
        className={cn('snow-btn', variantClasses[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
