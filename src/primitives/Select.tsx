/**
 * Built-in Select component using Radix UI
 */

import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '../icons';
import { ReactNode } from 'react';

import { cn } from '../utils';

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
  return (
    <SelectPrimitive.Trigger className={cn('snow-select-trigger', className)}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="snow-select-icon" />
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
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className="snow-select-content"
        position="popper"
        sideOffset={4}
      >
        <SelectPrimitive.Viewport className="snow-select-viewport">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

interface ItemProps {
  value: string;
  children: ReactNode;
}

function Item({ value: itemValue, children }: ItemProps) {
  return (
    <SelectPrimitive.Item value={itemValue} className="snow-select-item">
      <span className="snow-select-item-indicator">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="snow-size-4" />
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
