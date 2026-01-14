/**
 * Built-in Select component using Radix UI
 *
 * STRUCTURE (fixed): layout, positioning, sizing
 * VISUAL (customizable via registry): bg, border, rounded, shadow, text colors
 */

import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '../icons';
import { ReactNode } from 'react';

import { getStyles } from '../registry';
import { cn } from '../utils';

// Fixed structural styles - not customizable (matches shadcn h-9)
const STRUCTURE_TRIGGER =
  'flex h-9 w-full items-center justify-between gap-2 px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1';
const STRUCTURE_CONTENT =
  'relative z-50 max-h-96 min-w-[8rem] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
const STRUCTURE_VIEWPORT =
  'p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]';
const STRUCTURE_ITEM =
  'relative flex w-full cursor-default select-none items-center py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

interface RootProps {
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
}

function Root({ value, onValueChange, children }: RootProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      {children}
    </SelectPrimitive.Root>
  );
}

interface TriggerProps {
  className?: string;
  children: ReactNode;
}

function Trigger({ className, children }: TriggerProps) {
  const styles = getStyles();

  return (
    <SelectPrimitive.Trigger className={cn(STRUCTURE_TRIGGER, styles.select.trigger, className)}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

interface ValueProps {
  children?: ReactNode;
  placeholder?: string;
}

function Value({ placeholder }: ValueProps) {
  return <SelectPrimitive.Value placeholder={placeholder} />;
}

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  const styles = getStyles();

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(STRUCTURE_CONTENT, styles.select.content)}
        position="popper"
        sideOffset={4}
      >
        <SelectPrimitive.Viewport className={STRUCTURE_VIEWPORT}>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

interface ItemProps {
  value: string;
  children: ReactNode;
}

function Item({ value: itemValue, children }: ItemProps) {
  const styles = getStyles();

  return (
    <SelectPrimitive.Item
      value={itemValue}
      className={cn(STRUCTURE_ITEM, styles.select.item, 'focus:bg-accent focus:text-accent-foreground')}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export const Select = {
  Root,
  Trigger,
  Value,
  Content,
  Item,
};
