/**
 * Link Registry
 *
 * Allows consumers to provide their own Link component (react-router, next/link, etc.)
 */

import type { ComponentType, ReactNode } from 'react';

export interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

const DefaultLink = ({ to, children, className, target, rel, disabled }: LinkProps) => (
  <a
    href={disabled ? undefined : to}
    className={className}
    target={target}
    rel={rel}
    aria-disabled={disabled}
    style={disabled ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
  >
    {children}
  </a>
);

let RegisteredLink: ComponentType<LinkProps> = DefaultLink;

export const registerLinkComponent = (component: ComponentType<LinkProps>) => {
  RegisteredLink = component;
};

export const getLink = () => RegisteredLink;

export const resetLinkRegistry = () => {
  RegisteredLink = DefaultLink;
};
