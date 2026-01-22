/**
 * Built-in Button component
 */

import { forwardRef, type ReactNode, type MouseEventHandler, type MouseEvent } from 'react';

import { cn } from '../utils';

export interface ButtonProps {
  children?: ReactNode;
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
        className={cn('snow-btn', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
