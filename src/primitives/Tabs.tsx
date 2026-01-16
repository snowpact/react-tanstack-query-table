/**
 * Built-in Tabs component using Radix UI
 */

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ReactNode } from 'react';

import { cn } from '../utils';

interface RootProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

function Root({ value, onValueChange, children }: RootProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      {children}
    </TabsPrimitive.Root>
  );
}

interface ListProps {
  children: ReactNode;
  className?: string;
}

function List({ children, className }: ListProps) {
  return (
    <TabsPrimitive.List className={cn('snow-tabs-list', className)}>{children}</TabsPrimitive.List>
  );
}

interface TriggerProps {
  value: string;
  children: ReactNode;
}

function Trigger({ value, children }: TriggerProps) {
  return (
    <TabsPrimitive.Trigger value={value} className="snow-tabs-trigger">
      {children}
    </TabsPrimitive.Trigger>
  );
}

export const Tabs = {
  Root,
  List,
  Trigger,
};
