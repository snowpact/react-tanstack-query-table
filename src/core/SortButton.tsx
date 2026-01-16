/**
 * Sort button indicator component
 */

import { Column } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from '../icons';
import { cn } from '../utils';

const iconClassName = cn('h-[15px] w-[15px] text-foreground');

export interface SortButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, any>;
}

export function SortButton({ column }: SortButtonProps) {
  if (column.getCanSort() === false) {
    return null;
  }

  return column.getIsSorted() ? (
    column.getIsSorted() === 'desc' ? (
      <ChevronDown className={iconClassName} />
    ) : (
      <ChevronUp className={iconClassName} />
    )
  ) : (
    <ChevronsUpDown className={iconClassName} />
  );
}
