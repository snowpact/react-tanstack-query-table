/**
 * Link Registry
 *
 * Allows consumers to provide their own Link component (react-router, next/link, etc.)
 */

import type { ComponentType, ReactNode, MouseEvent } from 'react';

export interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  'aria-disabled'?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseEnter?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: () => void;
}

const DefaultLink = ({ to, children, className, target, rel, onClick, onMouseEnter, onMouseLeave }: LinkProps) => (
  <a href={to} className={className} target={target} rel={rel} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
