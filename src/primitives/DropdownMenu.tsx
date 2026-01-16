/**
 * Built-in DropdownMenu component using Radix UI
 *
 * STRUCTURE (fixed): layout, positioning, sizing, animations
 * VISUAL (customizable via registry): bg, border, rounded, shadow, text colors
 */

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon } from '../icons';
import { ReactNode } from 'react';

import { getStyles } from '../registry';
import { cn } from '../utils';

// Fixed structural styles - not customizable
const STRUCTURE_CONTENT =
  'z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-x-hidden overflow-y-auto p-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';
const STRUCTURE_ITEM =
  'relative flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
const STRUCTURE_CHECKBOX_ITEM =
  'relative flex cursor-default select-none items-center gap-2 py-1.5 pr-2 pl-8 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';
const STRUCTURE_SEPARATOR = '-mx-1 my-1 h-px';

interface RootProps {
  children: ReactNode;
}

function Root({ children }: RootProps) {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>;
}

interface TriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

function Trigger({ asChild, children }: TriggerProps) {
  return <DropdownMenuPrimitive.Trigger asChild={asChild}>{children}</DropdownMenuPrimitive.Trigger>;
}

interface ContentProps {
  align?: 'start' | 'end' | 'center';
  sideOffset?: number;
  className?: string;
  children: ReactNode;
}

function Content({ align = 'end', sideOffset = 4, className, children }: ContentProps) {
  const styles = getStyles();

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(STRUCTURE_CONTENT, styles.dropdown.content, className)}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

interface ItemProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
  children: ReactNode;
}

function Item({ onClick, disabled, className, asChild, children }: ItemProps) {
  const styles = getStyles();

  return (
    <DropdownMenuPrimitive.Item
      onClick={onClick}
      disabled={disabled}
      asChild={asChild}
      className={cn(STRUCTURE_ITEM, styles.dropdown.item, className)}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

interface CheckboxItemProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  children: ReactNode;
}

function CheckboxItem({ checked, onCheckedChange, className, children }: CheckboxItemProps) {
  const styles = getStyles();

  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(STRUCTURE_CHECKBOX_ITEM, styles.dropdown.checkboxItem, className)}
    >
      <span className={cn('pointer-events-none absolute left-2 flex size-3.5 items-center justify-center')}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className={cn('size-4')} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function Separator() {
  const styles = getStyles();
  return <DropdownMenuPrimitive.Separator className={cn(STRUCTURE_SEPARATOR, styles.dropdown.separator)} />;
}

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
  CheckboxItem,
  Separator,
};
