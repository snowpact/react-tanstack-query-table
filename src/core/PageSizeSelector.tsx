/**
 * Page size selector component
 */

import { Table } from '@tanstack/react-table';

import { Select } from '../primitives/Select';
import { getT } from '../registry';
import { cn } from '../utils';

import { DEFAULT_PAGE_SIZES } from './Pagination';

export type PageSizeSelectorProps<Data extends object> = {
  table: Table<Data>;
  paginationSizes?: number[];
  enableElementLabel?: boolean;
};

export function PageSizeSelector<Data extends object>({
  table,
  paginationSizes = DEFAULT_PAGE_SIZES,
  enableElementLabel = true,
}: PageSizeSelectorProps<Data>) {
  const t = getT();

  return (
    <div className={cn('flex items-center gap-2')}>
      {enableElementLabel && <span className={cn('text-sm text-muted-foreground')}>{t('dataTable.paginationSize')}</span>}
      <Select.Root
        value={table.getState().pagination.pageSize.toString()}
        onValueChange={value => {
          table.setPageSize(Number(value));
        }}
      >
        <Select.Trigger className={cn('h-8 w-[80px]')}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {paginationSizes.map((pageSize, index) => (
            <Select.Item key={pageSize + index} value={pageSize.toString()}>
              {pageSize}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
}
