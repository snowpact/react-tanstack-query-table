/**
 * Built-in Tabs component using Radix UI
 *
 * STRUCTURE (fixed): layout, sizing, focus states
 * VISUAL (customizable via registry): bg, rounded, shadow, text colors
 */

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ReactNode } from 'react';

import { getStyles } from '../registry';
import { cn } from '../utils';

// Fixed structural styles - not customizable (matches shadcn h-9 p-[3px])
const STRUCTURE_LIST = 'inline-flex h-9 w-fit items-center justify-center p-[3px]';
const STRUCTURE_TRIGGER =
  'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap border border-transparent transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';

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
  const styles = getStyles();

  return (
    <TabsPrimitive.List className={cn(STRUCTURE_LIST, styles.tabs.list, className)}>{children}</TabsPrimitive.List>
  );
}

interface TriggerProps {
  value: string;
  children: ReactNode;
}

function Trigger({ value, children }: TriggerProps) {
  const styles = getStyles();

  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(STRUCTURE_TRIGGER, styles.tabs.trigger, 'data-[state=active]:shadow-sm', styles.tabs.triggerActive)}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export const Tabs = {
  Root,
  List,
  Trigger,
};
