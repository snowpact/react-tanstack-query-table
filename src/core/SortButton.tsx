/**
 * Sort button indicator component
 */

import { Column } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from '../icons';

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
      <ChevronDown className="snow-sort-icon" />
    ) : (
      <ChevronUp className="snow-sort-icon" />
    )
  ) : (
    <ChevronsUpDown className="snow-sort-icon" />
  );
}
